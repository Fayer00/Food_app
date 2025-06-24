# Dockerfile

# Use the official Alpine-based Ruby image as a base image.
# This results in a much smaller final image.
FROM ruby:3.2.2-alpine

# Install essential system dependencies using Alpine's package manager (apk).
# - build-base: For compiling native gem extensions.
# - postgresql-dev: For the pg gem to connect to PostgreSQL.
# - nodejs & yarn: For the JavaScript asset pipeline.
# - gcompat: For glibc compatibility, required by some gems like Nokogiri.
# - libxml2-dev & libxslt-dev: Required for Nokogiri to compile.
# - tzdata: Provides timezone information needed by Rails.
RUN apk add --update --no-cache \
    build-base \
    postgresql-dev \
    nodejs \
    yarn \
    gcompat \
    libxml2-dev \
    libxslt-dev \
    tzdata

# Set the working directory inside the container.
WORKDIR /rails

# Copy the Gemfile and Gemfile.lock to the container.
# This allows us to cache the gem installation step.
COPY Gemfile Gemfile.lock ./
# Install the gems.
RUN bundle install

# Copy the package.json and yarn.lock.
COPY package.json yarn.lock ./
# Install JavaScript dependencies.
RUN yarn install

# Copy the rest of your application's code into the container.
COPY . .

# Expose port 3000 to allow external access to the app.
EXPOSE 3000

# The main command to run when the container starts.
# This will start the Rails server.
CMD ["./bin/dev"]