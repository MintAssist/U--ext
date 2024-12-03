# Extension Setup and Development Guide

## 1. Set Up Environment Variables

Before starting the project, you need to copy the example environment variables file and customize it for your environment.

```bash
cp .env.example .env

```

- This will create an .env file where you can define necessary environment-specific settings for the project.

## 2. Development Mode

To run the extension in development mode, follow these steps:

- Install the necessary dependencies (if not already installed):

```bash
yarn install
```

- Run the development server:

```bash
yarn dev
```

- This will start the development mode, and you can begin working on the extension. Any changes made will be reflected immediately during development.

## 3. Building for Production

To prepare the extension for production, run the following command to create the build package:

```bash
yarn build
```

This will generate the production-ready files in the dist directory.

4. Loading the Extension into the Browser
Once the build is complete, follow these steps to load the extension into your browser:

Open your browser's extension page (usually chrome://extensions/ for Chrome).
Enable "Developer mode" if it is not already enabled.
Click on the "Load unpacked" button and select the dist directory where the build files are located.
