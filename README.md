# Dengue Combat Support Prototype - TchauDengue

![TchauDengue Logo](/images/logo.png)

This is a prototype project designed to support efforts in combating dengue fever in **São José do Rio Preto**, located in the state of São Paulo, Brazil. The goal is to provide a **user-friendly interface** featuring a wiki, interactive map pages, and statistical visualizations to facilitate access to data about prevention actions, case reports, and more.

## Features

### Wiki
A section to organize and present detailed information about dengue fever and related prevention strategies.

![Wiki Preview](/images/wiki.png)

### Interactive Maps
Displays georeferenced data, allowing users to explore hotspots and track prevention activities.

![Interactive Map Preview](/images/mapa.png)

### Statistics
Provides dynamic visualizations to analyze trends in reported cases and prevention efforts.

![Statistics Graph Preview](/images/grafico.png)

## Data Sources

- **Sisaweb API**: Live data is fetched from the Sisaweb system, which provides updated information about dengue prevention and reported cases.
- **Local CSV Files**: Additional data is stored locally in CSV files for easy integration and backup.

## Planned Features

- **Improved Text Editing Interface**: A more intuitive and flexible text editor for updating wiki content.
- **Backend Caching**: To avoid fetching data from the API on every page load, future implementations will include caching mechanisms. This will store data on the backend temporarily and reduce redundant API calls, improving performance and reducing load times.

---


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Dependencies

This project includes the following dependencies:

- [Heroicons](https://heroicons.com/): To use icons in the project.
  
  Install Heroicons with:

  ```bash
  npm install @heroicons/react
  # or
  yarn add @heroicons/react
  # or
  pnpm add @heroicons/react
  ```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
