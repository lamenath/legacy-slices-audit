# Prismic Custom Types Utility

## Purpose

This utility app interacts with the Prismic Custom Types API to retrieve all the custom types in use in a Prismic repository. It displays each custom type and lists the associated slices. Additionally, it provides an overview of all slices used across different types and allows the user to download this data in CSV format.

## Features

- Retrieve and display custom types from a specified Prismic repository.
- List slices associated with each custom type.
- Overview of all slices used across types.
- Option to download custom types and slices data as CSV files.

## Usage

### Prerequisites

To run this utility locally, ensure you have the following installed:

- Node.js (Download and install from [Node.js website](https://nodejs.org/))

### Running the Utility Locally

1. **Clone the Repository:**
   
   ```bash
   git clone https://github.com/lamenath/legacy-slices-audit
   cd legacy-slices-audit
   ```

2. **Install Dependencies:**

   Install the necessary Node.js packages:

   ```bash
   npm install
   ```

3. **Start the Backend Server:**

   ```bash
   node server.js
   ```

   This will start the server on `localhost:3000` by default.

4. **Open the Frontend:**

   Open the http://localhost:3000/ with a web browser.

5. **Use the Utility:**

   - Enter the repository ID and bearer token in the provided form (token to be generated from the Custom Types API tab of your repository API settings https://{your-repository-name}.prismic.io/settings/apps/)
   - Submit the form to fetch and display the custom types and slices.
   - Use the provided links to download the data as CSV files.
