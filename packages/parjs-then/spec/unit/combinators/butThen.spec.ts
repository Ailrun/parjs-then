import { string } from "@lib";
import { butThen } from "@lib/combinators";

describe("butThen", () => {
    it("succeeds", () => {
        const parser = string("ab").pipe(butThen(string("cd")));
        expect(parser.parse("abcd")).toBeSuccessful("cd");
    });
});
