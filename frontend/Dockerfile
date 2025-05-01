# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install build dependencies for Alpine
RUN apk update && apk add --no-cache \
    build-base \
    libc6-compat \
    python3 \
    && rm -rf /var/cache/apk/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN rm -rf node_modules package-lock.json
RUN npm install

# Copy rest of the code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
