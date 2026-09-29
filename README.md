# Resume Generator

A free, no-sign-up resume builder that runs entirely in the browser. Fill in your details, watch the A4 preview update live, pick a template, and save it as a PDF. Your data stays on your device (browser `localStorage`).

## Features

- Live A4 preview with a page counter (warns when the resume runs past one page)
- Three templates: Classic, Modern, Compact, plus an accent colour picker
- Sections: personal details, summary, education, experience, projects, skills, achievements
- Add, remove and reorder entries
- Save as PDF through the browser print dialog
- Import / export your data as JSON
- Autosave in the browser, responsive on mobile
- No build step, no dependencies

## Project structure

```
resume-generator/
├── index.html   page markup
├── style.css    app and template styles
├── script.js    state, editor, preview, import/export
├── README.md
├── LICENSE
└── .gitignore
```

## Run locally in VS Code

1. Open the folder in VS Code (`File > Open Folder`).
2. Install the **Live Server** extension.
3. Right-click `index.html` and choose **Open with Live Server**.

You can also just double-click `index.html` to open it in a browser.

## Publish on GitHub Pages

1. Create a new repository on GitHub (for example `resume-generator`).
2. In the project folder, run:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: resume generator"
   git branch -M main
   git remote add origin https://github.com/<your-username>/resume-generator.git
   git push -u origin main
   ```

3. On GitHub, go to **Settings > Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose branch `main` and folder `/ (root)`, then save.
5. After a minute, your site is live at `https://<your-username>.github.io/resume-generator/`.

## Customise

- Replace the sample data in the `SAMPLE` object at the top of `script.js`.
- Add or edit templates in `style.css` (classes `.t-classic`, `.t-modern`, `.t-compact`) and add an `<option>` for each in `index.html`.
- If you change the shape of the saved data, bump the `KEY` version in `script.js` so old browser data does not clash.

## Tips for a good resume

- Keep it to one page for internships and early roles.
- Start bullets with a strong verb and include a number or result.
- Use the Classic or Compact template for applicant tracking systems.

## License

MIT
