#!/bin/bash

# Convert TypeScript files to JavaScript
convert_ts_to_js() {
  # Get the directory of the file
  dir=$(dirname "$1")
  # Get the filename without extension
  filename=$(basename "$1" .tsx)
  
  # Create destination path with .jsx extension
  dest="${dir}/${filename}.jsx"
  
  echo "Converting $1 to $dest"
  
  # Create a JavaScript version by:
  # 1. Removing TypeScript type annotations
  # 2. Removing interface and type declarations
  # 3. Removing type imports
  # 4. Removing generic type parameters
  
  cat "$1" | \
    sed 's/: [A-Za-z0-9_<>[\]|&(){}.,?]*//g' | \
    sed '/^interface /,/^}/d' | \
    sed '/^type /,/^}/d' | \
    sed '/import.*type.*/d' | \
    sed 's/<[A-Za-z0-9_<>[\]|&(){}.,?]*>//g' > "$dest"
    
  echo "Converted $1 to $dest"
}

# Process a batch of files
process_batch() {
  local files=("$@")
  for file in "${files[@]}"; do
    convert_ts_to_js "$file"
  done
}

# Get list of all TSX files in pages directory (main pages)
echo "Converting main page components..."
tsx_files=$(find client/src/pages -maxdepth 1 -name "*.tsx")
readarray -t tsx_files_array <<< "$tsx_files"
process_batch "${tsx_files_array[@]}"

# Get additional supplier page components
echo "Converting supplier page components..."
tsx_files=$(find client/src/pages/supplier -name "*.tsx" | grep -v "dashboard.tsx\|orders.tsx")
readarray -t tsx_files_array <<< "$tsx_files"
process_batch "${tsx_files_array[@]}"

# Get header and footer components
echo "Converting layout components..."
tsx_files=$(find client/src/components/layout -name "*.tsx")
readarray -t tsx_files_array <<< "$tsx_files"
process_batch "${tsx_files_array[@]}"

# Get more UI components
echo "Converting more UI components..."
tsx_files=$(find client/src/components/ui -name "*.tsx" | sort | head -30)
readarray -t tsx_files_array <<< "$tsx_files"
process_batch "${tsx_files_array[@]}"

# Get hooks
echo "Converting hooks..."
tsx_files=$(find client/src/hooks -name "*.tsx" -o -name "*.ts" | grep -v "use-auth.tsx")
readarray -t tsx_files_array <<< "$tsx_files"
process_batch "${tsx_files_array[@]}"

# Get utility files
echo "Converting utility files..."
tsx_files=$(find client/src/lib -name "*.ts" | grep -v "protected-route.tsx\|queryClient.ts")
readarray -t tsx_files_array <<< "$tsx_files"
process_batch "${tsx_files_array[@]}"

echo "Conversion complete"