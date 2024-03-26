var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const homePage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
      <title>Posts</title>
    </head>
    <body>
      <div class='bg-zinc-800 min-h-screen text-white'>
    <div class='flex flex-col justify-center items-center min-h-[70vh]'>
    <section class="text-center flex flex-col gap-2">
    <h4>This Are The Blogs Api.</h4>
    <a href='https://github.com/jihad-hossain1'>
    <h1>Contacts Us</h1>
    </a >
  <form class='flex flex-col gap-3'>
  <input type="text" class='p-2 bg-transparent rounded max-w-[300px] border border-yellow-600' placeholder='Email' required />
  <button class='text-sm border px-3 py-1 border-gray-700 rounded-md shadow bg-slate-600' type='submit'>
  send
  </button>
  </form>
    </section>
    </div>
      </div>
    </body>
    </html>`);
});
export { homePage };
//# sourceMappingURL=homePageController.js.map