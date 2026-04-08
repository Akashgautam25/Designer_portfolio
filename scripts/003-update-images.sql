-- Update project images with generated thumbnails
UPDATE projects SET thumbnail_url = '/images/projects/ecommerce.jpg' WHERE slug = 'ecommerce-platform';
UPDATE projects SET thumbnail_url = '/images/projects/saas-dashboard.jpg' WHERE slug = 'saas-dashboard';
UPDATE projects SET thumbnail_url = '/images/projects/mobile-banking.jpg' WHERE slug = 'mobile-banking-app';
