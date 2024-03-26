var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from "node-fetch"; // Import fetch
export function getPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch("http://localhost:9000/api/v1/posts/all-posts"); // Await the fetch call
            if (!res.ok) {
                throw new Error(`Failed to fetch posts: ${res.statusText}`);
            }
            return yield res.json();
        }
        catch (error) {
            console.error(error);
            return []; // Return an empty array if fetching fails
        }
    });
}
//# sourceMappingURL=posts.js.map