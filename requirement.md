**Product Requirement Document (PRD)** combined with **System Architecture** instructions.

> **Role & Objective**
> You are an Expert Full-Stack Web Developer, UI/UX Designer, and System Architect. Your task is to design, architect, and build a complete web application for a Non-Profit Organization (NGO) focused on healthcare.
> 
> 
> **Project Mission & Context**
> The NGO's core mission is to provide underprivileged individuals with free, top-tier medical diagnoses from renowned doctors. The NGO covers all costs (medicines, X-rays, treatments) and handles all government registrations and paperwork so the patient experiences zero administrative or financial burden.
> 
> 
> **Core Deliverables & Features**
> Please build this project encompassing the following modules:
> 
> **1. Public-Facing Website (Front-End)**
> * **Modern, Empathetic UI/UX:** Clean, accessible, and highly responsive design that clearly communicates the NGO's mission and builds trust.
> * **Events Section:** A dynamic page showcasing medical camps and outreach programs. Must support high-quality image galleries and embedded videos of past and upcoming events.
> * **Blog/News Section:** Educational and promotional content to raise awareness, share success stories, and advertise upcoming initiatives.
> * **Core Pages:** Home, About Us (Mission/Vision), Services (Diagnosis, Pharmacy, X-Ray, Govt. Registration), Contact/Help line.
> 
> **2. Advanced Admin Panel (Custom CMS)**
> * **No-Code Content Management:** A highly intuitive dashboard for the client to easily Create, Read, Update, and Delete (CRUD) Blog posts and Events without touching the codebase.
> * **Advanced SEO Module:** Every Blog and Event creation page must include dedicated SEO input fields: Meta Title, Meta Description, Focus Keywords, Canonical URL, and Image Alt-Text. These fields must dynamically inject into the `<head>` of the respective front-end pages to ensure high search engine rankings.
> 
> **3. Automated Media Optimization Algorithm (The Pipeline)**
> * **Requirement:** The client will upload raw, unoptimized images and videos. The backend must automatically process these before serving them to the public site.
> * **Image Processing:** Intercept image uploads and use an industry-standard library (e.g., `Sharp` for Node.js). Compress the images losslessly (or with high-quality lossy settings) and convert them to `.webp` format.
> * **Video Processing:** Intercept video uploads and use a processing tool (e.g., `FFmpeg`). Compress the videos for web playback without noticeable quality loss and convert them to `.webm` (and `.mp4` fallback) formats.
> * **Storage:** Save the optimized files to the database/cloud storage and ensure the front-end dynamically serves these lightweight formats for maximum page speed.
> 
> 
> **Tech Stack Preferences**
> *Please suggest the most optimal modern tech stack (e.g., Next.js for SEO/SSR, Node.js/Express for the backend, PostgreSQL or MongoDB, and AWS S3/Cloudinary for media).*
> 
> 
> **Instructions for the AI:**
> 1. Start by proposing the complete Tech Stack and System Architecture based on my requirements.
> 2. Outline the Database Schema (focusing on Events, Blogs, Users/Admins, and SEO metadata).
> 3. Provide the backend code for the Media Optimization Algorithm (the upload pipeline).
> 4. Generate the foundational code for the Admin Panel and Front-End.
> 
> 
> Await my approval on step 1 before writing the code for step 2.