# Use the node:18 image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the contents of the app directory into the container's working directory
COPY ./my_app/ /usr/src/app/

# Expose port 8080
EXPOSE 8080

# Install npm dependencies
RUN npm install

# Specify the command to run when the container starts
CMD ["node", "backend.js"]
