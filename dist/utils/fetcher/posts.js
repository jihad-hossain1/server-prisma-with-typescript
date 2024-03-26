import fetch from "node-fetch"; // Import fetch
export async function getPosts() {
    try {
        const res = await fetch("http://localhost:9000/api/v1/posts/all-posts"); // Await the fetch call
        if (!res.ok) {
            throw new Error(`Failed to fetch posts: ${res.statusText}`);
        }
        return await res.json();
    }
    catch (error) {
        console.error(error);
        return []; // Return an empty array if fetching fails
    }
}
//# sourceMappingURL=posts.js.map