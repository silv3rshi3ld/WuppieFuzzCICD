# Use an appropriate base image
FROM rust:latest

# Set the working directory
WORKDIR /WuppieFuzz

# Copy Cargo files
COPY Cargo.toml Cargo.lock ./

# Fetch dependencies
RUN cargo fetch

# Copy the source code
COPY src ./src

# Build the application
RUN cargo build --release

# Expose any necessary ports (if applicable)
EXPOSE 3001

# Set the entrypoint or command (modify as needed)
CMD ["./target/release/wuppiefuzz"]
