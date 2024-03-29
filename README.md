# NFL Table

NFL Table is a React single-page web application and API backend for interactively querying, filtering, and analyzing 500MB of play-by-play NFL statistics spanning the past ~10 seasons.

The site was built as a personal side project to grow my skills in full-stack web development and cloud applications.

Visit the site here: https://www.nfltable.com/

Thoughts and feedback are welcome!

## Tools & Technologies
- **React**: This was my first large project using React. Other utilized libraries include React Router (routing) and Ant Design (UI component toolkit)
- **Typescript**: I initially built the front-end using exclusively Javascript. However, I found myself struggling to keep track of the "shape" of the data at different phases. Midway through, I learned about Typescript, taught myself the basics, and refactored much of the front-end using this approach.  
- **Node.js & Express**: Used for the application backend including the interactive querying engine and a "metadata" glue which ties the database backend to the front-end. 
- **Python & Pandas**: Used for ETL (data acqusition & lightweight transformation)
- **Firebase Hosting**: Used a serverless architecture approach
- **Google Cloud Functions**: Used for the API layer
- **Google BigQuery**: Used for analytical datastore (play-by-play statistics data)
- **Google Firestore**: Used for application datastore

## Site Features
- **Save & Load**: After creating a custom query, users can save it into a unique shareable URL. Upon loading this URL, the application state will be restored (all the same fields and filters are pre-selected).
- **Custom Fields**: In addition to pre-populated metrics (e.g. Pass Attempts, Interceptions), users can create on-the-fly calculations by adding, subtracting, multiplying, or dividing these fields (e.g. Interceptions divided by Pass Attempts derives an Interception Rate metric).
- **Drill-down Linking**: Clicking on player & team names will cross-link into specific profile pages. Opening these pages in Custom Query then provides a starting point for a new query.
- **Download**: Data can be downloaded to CSV.
