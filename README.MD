# xa-create-vite-react

A simple CLI tool to scaffold a Vite + React + Tailwind project.

## 📦 Install (one time)

```bash
npm install -g xa-create-react-tailwind-rtk
```

## 🚀 Usage

Create a new project:

```bash
xa-create-react-tailwind-rtk myapp
```

This will:

1. Copy the built-in template into `myapp` folder.
2. Run `npm install` inside the new folder automatically.
3. Print next steps to start the dev server.

## 🔧 Start

```bash
cd myapp
npm run dev
```

## 💡 Alternative (no global install)

You can run without global install using `npx` (if you published with the same name):

```bash
npx xa-create-react-tailwind-rtk myapp
```

## Notes

- Remove `node_modules` from the `template` folder before publishing.
- Ensure Node.js v16+ is installed.
