import { ResultKind, eof, fail, rest, string } from "@lib";
import { andThen, each, followedBy, mapConst } from "@lib/combinators";

const excessInput = "abcde";

describe("andThen", () => {
    describe("1 arg", () => {
        const parser = string("ab").pipe(andThen(string("cd")));
        it("succeeds", () => {
            expect(parser.parse("abcd")).toBeSuccessful(["ab", "cd"]);
        });
        it("fails softly on first fail", () => {
            expect(parser.parse("a")).toBeFailure(ResultKind.SoftFail);
        });
        it("fails hard on 2nd fail", () => {
            expect(parser.parse("ab")).toBeFailure(ResultKind.HardFail);
        });
        it("fails on excess input", () => {
            expect(parser.parse(excessInput)).toBeFailure(ResultKind.SoftFail);
        });

        it("fails hard on first hard fail", () => {
            const parser2 = fail().pipe(andThen("hi"));
            expect(parser2.parse("hi")).toBeFailure("Hard");
        });

        it("fails fatally on 2nd fatal fail", () => {
            const parser2 = string("hi").pipe(
                andThen(
                    fail({
                        kind: "Fatal"
                    })
                )
            );
            expect(parser2.parse("hi")).toBeFailure("Fatal");
        });

        it("chain zero-matching parsers", () => {
            const parser2 = string("hi").pipe(andThen(rest(), rest()));
            expect(parser2.parse("hi")).toBeSuccessful(["hi", "", ""]);
        });
    });

    describe("1 arg, then zero consume", () => {
        const parser = string("ab").pipe(andThen(string("cd")), followedBy(eof()));
        it("succeeds", () => {
            expect(parser.parse("abcd")).toBeSuccessful(["ab", "cd"]);
        });
        it("fails hard when 3rd fails", () => {
            expect(parser.parse(excessInput)).toBeFailure(ResultKind.HardFail);
        });
    });

    it("2 args", () => {
        const p2 = string("b").pipe(mapConst(1));
        const p3 = string("c").pipe(mapConst([] as string[]));

        const p = string("a").pipe(
            andThen(p2, p3),
            each(x => {
                Math.log(x[1]);
                x[0].toUpperCase();
                x[2].map(xx => xx.toUpperCase());
            })
        );

        expect(p.parse("abc")).toBeSuccessful(["a", 1, []]);
    });

    it("3 args", () => {
        const p2 = string("b").pipe(mapConst(1));
        const p3 = string("c").pipe(mapConst([] as string[]));

        const p4 = string("d").pipe(mapConst(true));

        const p = string("a").pipe(
            andThen(p2, p3, p4),
            each(x => {
                Math.log(x[1]);
                x[0].toUpperCase();
                x[2].map(xx => xx.toUpperCase());
            })
        );

        expect(p.parse("abcd")).toBeSuccessful(["a", 1, [], true]);
    });
});
