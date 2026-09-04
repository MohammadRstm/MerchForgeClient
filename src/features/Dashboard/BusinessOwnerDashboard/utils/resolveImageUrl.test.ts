import { describe, expect, it } from "vitest";
import { resolveImageUrl } from "./resolveImageUrl";

/**
 * This helper had no tests, and the move of product images to object storage made
 * that a real gap: the API now returns absolute URLs for product images while still
 * returning API-relative paths for images stored before the move, and for logos and
 * template previews, which have not moved. Both shapes have to keep working, and
 * roughly forty existing fixtures elsewhere only ever exercise the relative one.
 */
describe("resolveImageUrl", () => {
    const apiOrigin = "https://localhost:7021";

    it("prefixes the API origin onto a path relative to it", () => {
        expect(resolveImageUrl("/uploads/products/abc/def.jpg")).toBe(
            `${apiOrigin}/uploads/products/abc/def.jpg`
        );
    });

    it("returns an absolute URL unchanged", () => {
        const url = "https://pub-abc123.r2.dev/businesses/b/products/p/images/i.jpg";

        expect(resolveImageUrl(url)).toBe(url);
    });

    it("does not prefix an http URL either", () => {
        const url = "http://cdn.example.com/a.png";

        expect(resolveImageUrl(url)).toBe(url);
    });

    /**
     * VITE_SERVER_URL_DEV carries a trailing slash in the checked-in example env, so
     * the single trailing-slash strip is the only thing standing between this and a
     * doubled slash in every dashboard image URL.
     */
    it("does not double the slash between origin and path", () => {
        expect(resolveImageUrl("/uploads/products/a.png")).not.toContain("//uploads");
    });
});
