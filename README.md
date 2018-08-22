# lightstack

# Lightstack

Super light Node-Express app with a built in gulp process.

## Main Stack

**Backend**
* Node
* Express
* Handlebars
* Sass

**Frontend**
* jQuery
* Tachyons
* Turbolinks

## Local Setup

1. Create your `.env` file in the project root directory and include the following environment variables:

	```
	MODE=development
	```

2. Run the following:

	```
	npm install
	npm run dev
	```

## Local Production

To run production on local:

```
npm run start
```

## Repo Organization

### Server

All serverside files are placed in respective directories at project root. The main Express server runs in `app.js`, using Handlebars to render all views serverside and serve static HTML for SEO.

### Client

Clientside static files should be added to `/public` in their respective folders. Global JS/CSS files are added to the main layout view, and route-specific files are added in the route modules.

### Routes

Routes are packaged individually into controller modules and included on the main `app.js` server. Each route controller handles data fetches and file inclusions. The main layout view is configured to inject the route-specific files as link or script tags.

### Stylesheets

All styles are written in Sass and compiled into CSS using `node-sass-middleware`. The final CSS file is included on the layout view.
