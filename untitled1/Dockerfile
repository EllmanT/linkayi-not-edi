FROM node:18
LABEL authors="Dubem"

WORKDIR /app

# Copy package files separately to leverage Docker layer caching
COPY package.json .
COPY package-lock.json .

# Install Node.js dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . /app

CMD ["npm", "start"]
