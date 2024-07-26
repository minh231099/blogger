# Welcome to My Blog Project!

## Installation

First, we need to install all dependencies:

with Yarn:
```shellscrpit
yarn install
```

with NPM:
```shellscrpit
npm install
```

and create .env file to save two variables:
```
DATABASE_URL="file:./dev.db"
SECRET_KEY="bloggeraura"
```

## Developer:

**To run the code:**

```shellscript
npm run dev
```
*Or*
```shellscript
yarn dev
```

**To run Prisma Studio:**

```shellscript
npx prisma studio
```


## About Project

This is my first time working with Remix, and I’ve put in a lot of effort to build a great website. For my blog, I’m using:

- Remix
- Tailwind CSS
- SQLite  

I’m also incorporating Prisma to manage database interactions. Although this setup might not be perfect, it helps me avoid the complexity of a separate backend server, which is a big advantage given my time constraints.  

Additionally, I’m utilizing a rich text editor library called PlateJS to create and update blog posts.  

The main goal of my website is to offer a platform where registered users can read and write blogs, sharing their thoughts with the community. I’ve implemented essential features such as adding, deleting, updating, and reading blogs, along with login, registration, and logout functionalities. My concept is inspired by a website called [Spiderum](https://spiderum.com/).  "# blogger" 
