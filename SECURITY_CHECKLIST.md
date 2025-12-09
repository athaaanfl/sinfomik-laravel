# ⚠️ IMPORTANT SECURITY NOTICE

Before deploying to production, make sure you have completed the following checklist:

## 🔐 Security Checklist

### Environment Configuration
- [ ] Copy `.env.production.example` to `.env` on production server
- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false` (CRITICAL!)
- [ ] Generate new `APP_KEY` using `php artisan key:generate`
- [ ] Update `APP_URL` with your actual domain
- [ ] Configure proper database credentials
- [ ] Set `SESSION_SECURE_COOKIE=true` for HTTPS
- [ ] Configure real SMTP mail settings (not `log`)

### Database
- [ ] Database is created on production server
- [ ] Database user has proper permissions
- [ ] Consider using password for MySQL (even though your VPS doesn't use one)
- [ ] MySQL only listens on localhost
- [ ] Setup regular database backups

### Web Server
- [ ] SSL certificate is installed (Let's Encrypt recommended)
- [ ] HTTPS is enforced (HTTP redirects to HTTPS)
- [ ] Proper file permissions are set (www-data:www-data)
- [ ] `storage/` and `bootstrap/cache/` are writable (775)
- [ ] Sensitive directories are protected in nginx config

### System
- [ ] Firewall is enabled (UFW)
- [ ] Only necessary ports are open (22, 80, 443)
- [ ] System is updated: `apt update && apt upgrade`
- [ ] Supervisor is running for queue workers
- [ ] Logs are being written and rotated

### Laravel Application
- [ ] All migrations are run
- [ ] Storage link is created: `php artisan storage:link`
- [ ] Config is cached: `php artisan config:cache`
- [ ] Routes are cached: `php artisan route:cache`
- [ ] Views are cached: `php artisan view:cache`
- [ ] Application is optimized: `php artisan optimize`

### Monitoring
- [ ] Setup error logging and monitoring
- [ ] Configure log rotation
- [ ] Setup disk space monitoring
- [ ] Configure email notifications for critical errors

## 🚨 NEVER DO THIS IN PRODUCTION

- ❌ Don't set `APP_DEBUG=true`
- ❌ Don't commit `.env` file to repository
- ❌ Don't expose database credentials
- ❌ Don't use default passwords
- ❌ Don't skip SSL certificate
- ❌ Don't leave storage directories publicly accessible
- ❌ Don't forget to restart services after deployment
- ❌ Don't deploy without testing first

## 📚 Read More

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete deployment instructions.
