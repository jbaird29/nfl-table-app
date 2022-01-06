# NFL Table

NFL Table is a React single-page web application and API backend for interactively querying, filtering, and analyzing 500MB of play-by-play NFL statistics spanning the past ~10 seasons.

The site was built as a personal side project to grow my skills in full-stack web development and cloud applications.

Visit the site here: https://www.nfltable.com/

Thoughts and feedback are welcome!

## Technologies Used
- **React**: This was my first large project using React. Other utilized libraries include React Router (routing) and Ant Design (UI component toolkit)
- **Typescript**: I initially built the front-end using exclusively Javascript. However, I found myself struggling to keep track of the "shape" of the data at different phases. Midway through, I learned about Typescript, taught myself the basics, and refactored much of the front-end using this approach.  
- **Node.js & Express**: Used for the application backend including the interactive querying engine and a "metadata" glue which ties the database backend to the front-end. 
- **Python & Pandas**: Used for ETL (data acqusition & lightweight transformation)
- **Firebase Hosting**: Used a serverless architecture approach
- **Google Cloud Functions**: Used for the API layer
- **Google BigQuery**: Used for analytical datastore (play-by-play statistics data)
- **Google Firestore**: Used for application datastore
