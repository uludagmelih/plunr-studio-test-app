<?php

/*
 * Project-owned business modules. Add modules/pages here or use:
 *   php artisan plunr:module-create inventory --label="Inventory"
 *   php artisan plunr:page-create inventory products
 */

return array (
  'inventory' => 
  array (
    'label' => 'Inventory',
    'icon' => 'Box',
    'order' => 0,
    'section' => 'Project',
    'pages' => 
    array (
      'warehouses' => 
      array (
        'label' => 'Warehouses',
        'route' => 'inventory.warehouses.index',
        'path' => '/inventory/warehouses',
        'page' => 'Inventory/Warehouses/Index',
        'icon' => 'FileText',
        'order' => 0,
        'quick_access' => false,
        'hidden' => false,
      ),
      'products' => 
      array (
        'label' => 'Products',
        'route' => 'inventory.products.index',
        'path' => '/inventory/products',
        'page' => 'Inventory/Products/Index',
        'icon' => 'FileText',
        'order' => 1,
        'quick_access' => true,
        'hidden' => false,
      ),
    ),
  ),
);
