FROM node:21-alpine AS builder

# Set the working directory in the Docker imgage
WORKDIR /app

COPY backend/package.json ./

# Install the dependencies in the Docker image
RUN ["npm", "install", "--legacy-peer-deps"]

COPY backend/src ./src

# Ensure tsconfig.json is also copied
COPY backend/tsconfig.json ./tsconfig.json

# Build the application
RUN npm run build

# Start a new stage to create a smaller final image
FROM node:21-alpine

# Set the working directory in the Docker image
WORKDIR /app 

# Copy the node_modules and built files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist 

EXPOSE 3000

CMD ["npm", "start"]