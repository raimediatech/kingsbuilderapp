# KingsBuilder Emergency Fixes Cleanup Script
# =====================================================
# This script backs up and removes all emergency fix files
# Run this after confirming the new system works properly

Write-Host "🧹 KingsBuilder Emergency Fixes Cleanup" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

$publicPath = "c:/Users/KingsBuilder/Desktop/KingsBuilder/KingsBuilder-Shopify/KingsBuilder/public"
$backupPath = "$publicPath/emergency-fixes-backup"

# Create backup directory
if (!(Test-Path $backupPath)) {
    New-Item -ItemType Directory -Path $backupPath -Force
    Write-Host "📁 Created backup directory: $backupPath" -ForegroundColor Green
}

# List of emergency fix files to backup and remove
$emergencyFiles = @(
    "emergency-*.js",
    "emergency-*.css",
    "*-fix.js",
    "*-fix.css",
    "critical-*.js",
    "CRITICAL-*.js",
    "CRITICAL-*.css",
    "temp-*.js",
    "temp-*.css",
    "working-*.js",
    "proper-*.js",
    "simple-*.js",
    "direct-*.js",
    "final-*.js",
    "FINAL-*.js",
    "complete-*.js",
    "COMPLETE-*.js",
    "comprehensive-*.js",
    "advanced-builder-fix.js",
    "builder-complete-fix.js",
    "builder-content-fix.js",
    "builder-icon-fix.js",
    "builder-ui-fix.css",
    "builder-test.js",
    "canvas-fix.js",
    "widget-system-fix.js",
    "initialization-fix.js",
    "auth-fix.js",
    "developer-tools-fix.js",
    "dashboard-icon-fix.css",
    "css-fix.css",
    "icon-fix.js",
    "page-content-fix.js",
    "restore-builder.js",
    "backup-system.js",
    "SINGLE-CLEAN-ELEMENTOR.js",
    "ELEMENTOR-*.js",
    "KINGSBUILDER-COMPLETE.js",
    "PUBLISH-FIX.js",
    "THEME-BUILDER.js",
    "GLOBAL-DESIGN-SYSTEM.js",
    "COMPLETION-WIDGETS.js",
    "ADVANCED-CSS-EXPORT.js"
)

$backedUpCount = 0
$removedCount = 0

Write-Host "🔍 Scanning for emergency fix files..." -ForegroundColor Yellow

foreach ($pattern in $emergencyFiles) {
    $files = Get-ChildItem -Path $publicPath -Name $pattern -ErrorAction SilentlyContinue
    
    foreach ($file in $files) {
        $fullPath = Join-Path $publicPath $file
        $backupFile = Join-Path $backupPath $file
        
        if (Test-Path $fullPath) {
            # Backup file
            Copy-Item $fullPath $backupFile -Force
            Write-Host "📦 Backed up: $file" -ForegroundColor Blue
            $backedUpCount++
            
            # Remove original
            Remove-Item $fullPath -Force
            Write-Host "🗑️  Removed: $file" -ForegroundColor Red
            $removedCount++
        }
    }
}

# Also backup and remove old builder files
$oldBuilderFiles = @(
    "builder-old.html",
    "builder-old.css",
    "builder-old.js"
)

foreach ($file in $oldBuilderFiles) {
    $fullPath = Join-Path $publicPath $file
    $backupFile = Join-Path $backupPath $file
    
    if (Test-Path $fullPath) {
        Copy-Item $fullPath $backupFile -Force
        Write-Host "📦 Backed up: $file" -ForegroundColor Blue
        $backedUpCount++
        
        Remove-Item $fullPath -Force
        Write-Host "🗑️  Removed: $file" -ForegroundColor Red
        $removedCount++
    }
}

Write-Host "" -ForegroundColor White
Write-Host "✅ Cleanup Summary:" -ForegroundColor Green
Write-Host "   📦 Files backed up: $backedUpCount" -ForegroundColor Blue
Write-Host "   🗑️  Files removed: $removedCount" -ForegroundColor Red
Write-Host "   📁 Backup location: $backupPath" -ForegroundColor Yellow

if ($backedUpCount -gt 0) {
    Write-Host "" -ForegroundColor White
    Write-Host "💡 Note: All emergency fix files have been backed up." -ForegroundColor Cyan
    Write-Host "   You can restore them from the backup directory if needed." -ForegroundColor Cyan
    Write-Host "   Once you confirm the new system works, you can delete the backup." -ForegroundColor Cyan
}

Write-Host "" -ForegroundColor White
Write-Host "🎉 Emergency fixes cleanup complete!" -ForegroundColor Green
Write-Host "   The new KingsBuilder Core system is now active." -ForegroundColor Green

# Create a summary file
$summaryFile = Join-Path $backupPath "cleanup-summary.txt"
$summary = @"
KingsBuilder Emergency Fixes Cleanup Summary
==========================================
Date: $(Get-Date)
Files backed up: $backedUpCount
Files removed: $removedCount

Backup location: $backupPath

The new KingsBuilder Core system is now active.
All emergency fixes have been replaced with a clean, maintainable architecture.

New system features:
- Clean modular architecture
- Professional UI/UX
- Complete widget system
- Advanced canvas functionality
- Proper history management
- Maintainable codebase

Files can be restored from this backup if needed.
"@

$summary | Out-File -FilePath $summaryFile -Encoding UTF8
Write-Host "📄 Summary saved to: cleanup-summary.txt" -ForegroundColor Cyan