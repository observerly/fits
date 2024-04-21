# Copyright © observerly Ltd

# //////////////////////////////////////////////////////////////////////////////////////////////////////////////////// #

# Base Node Image
FROM node:20.11-buster AS base

# Update apt cache:
RUN ["apt-get", "update"]

# Set the working directory, i.e., the directory within the container where the commands will be executed:
WORKDIR /usr/src/app

# Enable Corepack to manage package managers
RUN corepack enable

# Install the latest version of pnpm using corepack:
RUN corepack prepare pnpm@latest --activate

# //////////////////////////////////////////////////////////////////////////////////////////////////////////////////// #

# cfitsio Verify Image
FROM base AS fits

# Install the required packages for fitsverify (cfitsio)
RUN apt-get update && apt-get install -y \
        gcc \
        libcfitsio-bin \
        libcfitsio-dev

# Set the working directory to /usr/local/src:
WORKDIR /usr/local/src

# Set the version and URL for the fitsverify source code:
ARG FITSVERIFY_VERSION=4.22

# Set the url argument:
ARG FITSVERIFY_URL=https://heasarc.gsfc.nasa.gov/docs/software/ftools/fitsverify/fitsverify-${FITSVERIFY_VERSION}.tar.gz

# Download and extract fitsverify source code
ADD ${FITSVERIFY_URL} .

# Extract the tar.gz file
RUN tar xvf fitsverify-${FITSVERIFY_VERSION}.tar.gz

# Set the working directory to the base fitsverify-${FITSVERIFY_VERSION}:
WORKDIR /usr/local/src/fitsverify-${FITSVERIFY_VERSION}

# Compile the source code using gcc:
RUN gcc -o fitsverify ftverify.c fvrf_data.c fvrf_file.c fvrf_head.c fvrf_key.c fvrf_misc.c -DSTANDALONE -I/usr/local/include -L/usr/local/lib -lcfitsio -lm -lnsl

# Copy the compiled binary to /usr/local/bin/:
RUN cp ./fitsverify /usr/local/bin/

# Update shared library cache:
RUN ldconfig

# Remove the extracted source files:
RUN rm -rf fitsverify-${FITSVERIFY_VERSION}

# //////////////////////////////////////////////////////////////////////////////////////////////////////////////////// #

# Define a new build stage for the local environment:
FROM fits AS local

# Install szh shell:
RUN ["apt-get", "install", "-y", "zsh"]

# Install oh-my-zsh with specified plugins and theme:
RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.1.5/zsh-in-docker.sh)" -- \
    -t https://github.com/denysdovhan/spaceship-prompt \
    -a 'SPACESHIP_PROMPT_ADD_NEWLINE="false"' \
    -a 'SPACESHIP_PROMPT_SEPARATE_LINE="false"' \
    -p git \
    -p ssh-agent \
    -p https://github.com/zsh-users/zsh-autosuggestions \
    -p https://github.com/zsh-users/zsh-completions

# Copy the local environment files to the container:
COPY . .

# //////////////////////////////////////////////////////////////////////////////////////////////////////////////////// #