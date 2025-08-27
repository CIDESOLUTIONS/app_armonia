#!/bin/bash

# Find all TypeScript files in the src directory and apply replacements
find ./armonia-backend/src -type f -name "*.ts" -print0 | while IFS= read -r -d '\0' file; do
  # Replace relative paths with aliases
  sed -i "s|from '\.\./common|from '@armonia-backend/common|g" "$file"
  sed -i "s|from '\.\./\.\./common|from '@armonia-backend/common|g" "$file"
  sed -i "s|from '\.\./prisma|from '@armonia-backend/prisma|g" "$file"
  sed -i "s|from '\.\./\.\./prisma|from '@armonia-backend/prisma|g" "$file"
  sed -i "s|from '\.\./auth|from '@armonia-backend/auth|g" "$file"
  sed -i "s|from '\.\./\.\./auth|from '@armonia-backend/auth|g" "$file"

  # Fix specific enum import
  sed -i "s|from '\.\./common/enums/user-role.enum'|from '@prisma/client'|g" "$file"
  sed -i "s|from '\.\./\.\./common/enums/user-role.enum'|from '@prisma/client'|g" "$file"
done

echo "Import paths refactored."
