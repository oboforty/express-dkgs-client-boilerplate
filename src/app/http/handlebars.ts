import { create, engine } from "express-handlebars";

export default create({
  layoutsDir: "src/app/http/views/layouts",
  partialsDir: "src/app/http/views/partials",
  helpers: {
    foo: function () { return 'FOO!'; },
  }
});