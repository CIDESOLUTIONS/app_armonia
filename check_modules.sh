#!/bin/bash
set -e

MODULES=(
  "AuthModule"
  "UserModule"
  "SurveyModule"
  "PackagesModule"
  "VisitorsModule"
  "PqrModule"
  "PersonalFinancesModule"
  "ReservationsModule"
  "TenantModule"
  "InventoryModule"
  "CommunicationsModule"
  "FinancesModule"
  "ProjectsModule"
  "SecurityModule"
  "PlansModule"
  "BankReconciliationModule"
  "DocumentsModule"
  "PaymentGatewaysModule"
  "ResidentialComplexModule"
  "InsurtechModule"
  "ReportsModule"
  "StaffModule"
  "ServiceProvidersModule"
  "FintechModule"
  "IotModule"
  "PortfolioModule"
  "MarketplaceModule"
  "AssemblyModule"
  "PanicModule"
)

APP_MODULE_PATH="armonia-backend/src/app.module.ts"
ORIGINAL_APP_MODULE=$(cat $APP_MODULE_PATH)

for module in "${MODULES[@]}"; do
  echo "Testing module: $module"
  
  # Restore original app.module.ts
  echo "$ORIGINAL_APP_MODULE" > $APP_MODULE_PATH
  
  # Uncomment the current module
  sed -i "s/\/\/ $module,/$module,/" $APP_MODULE_PATH
  
  # Restart backend
  (cd armonia-backend && npm run build && npm run start:prod &)
  
  # Wait for backend to start
  sleep 5
  
  # Check if backend is running
  if ! pgrep -f "node dist/src/main"; then
    echo "Error: Backend failed to start with module $module"
    exit 1
  fi
  
  # Kill backend
  pkill -f "node dist/src/main"
done

echo "All modules loaded successfully!"
