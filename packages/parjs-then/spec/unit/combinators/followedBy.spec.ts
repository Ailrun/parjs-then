import { string } from "@lib";
import { followedBy } from "@lib/combinators";

describe("followedBy", () => {
    it("succeeds", () => {
        const parser = string("ab").pipe(followedBy(string("cd")));
        expect(parser.parse("abcd")).toBeSuccessful("ab");
    });
});
