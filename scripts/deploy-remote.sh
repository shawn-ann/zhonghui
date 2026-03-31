#!/bin/bash

# =============================================================================
# 中汇企业官网 - 远程服务器部署脚本
# =============================================================================
# 功能：
#   1. 解压部署包
#   2. 安装后端依赖
#   3. 配置环境变量
#   4. 启动后端服务（PM2）
# =============================================================================

# 配置
SERVER_PATH="/var/www/zhonghui"
BACKEND_DIR="$SERVER_PATH/backend"
DB_NAME="zhonghui"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 检查 MySQL 是否运行
check_mysql() {
    log_step "检查 MySQL 服务..."
    if systemctl is-active mysqld &> /dev/null || systemctl is-active mariadb &> /dev/null; then
        log_info "MySQL 服务运行中"
        return 0
    else
        log_error "MySQL 服务未运行，请先启动 MySQL"
        return 1
    fi
}

# 检查 Node.js
check_node() {
    log_step "检查 Node.js 环境..."
    if command -v node &> /dev/null; then
        log_info "Node.js 版本: $(node -v)"
        return 0
    else
        log_error "Node.js 未安装"
        return 1
    fi
}

# 检查 PM2
check_pm2() {
    log_step "检查 PM2..."
    if command -v pm2 &> /dev/null; then
        log_info "PM2 版本: $(pm2 --version)"
        return 0
    else
        log_error "PM2 未安装，请运行: npm install -g pm2"
        return 1
    fi
}

# 创建数据库
setup_database() {
    log_step "检查并创建数据库..."
    
    # 检查数据库是否存在
    if mysql -u root -e "SHOW DATABASES LIKE '$DB_NAME'" | grep -q "$DB_NAME"; then
        log_info "数据库 $DB_NAME 已存在"
    else
        log_info "创建数据库 $DB_NAME..."
        mysql -u root -e "CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        log_info "数据库创建完成"
    fi
}

# 导入初始数据
import_data() {
    log_step "导入初始数据..."
    
    if [ -f "$BACKEND_DIR/config/init.sql" ]; then
        mysql -u root "$DB_NAME" < "$BACKEND_DIR/config/init.sql"
        log_info "初始数据导入完成"
    else
        log_warn "未找到初始数据文件: $BACKEND_DIR/config/init.sql"
    fi
}

# 创建 .env 文件
setup_env() {
    log_step "配置 .env 文件..."
    
    if [ -f "$BACKEND_DIR/.env" ]; then
        log_info ".env 文件已存在，跳过创建"
    else
        log_info "创建 .env 文件..."
        
        # 读取 MySQL root 密码
        read -s -p "请输入 MySQL root 密码: " MYSQL_ROOT_PASS
        echo ""
        
        # 创建 .env 文件
        cat > "$BACKEND_DIR/.env" << ENVEOF
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=$MYSQL_ROOT_PASS
DB_NAME=zhonghui
UPLOAD_DIR=./uploads
ENVEOF
        
        log_info ".env 文件创建完成"
    fi
}

# 安装依赖
install_dependencies() {
    log_step "安装后端依赖..."
    
    cd "$BACKEND_DIR"
    npm install --production
    
    if [ $? -eq 0 ]; then
        log_info "依赖安装完成"
    else
        log_error "依赖安装失败"
        exit 1
    fi
}

# 创建上传目录
setup_upload_dir() {
    log_step "创建上传目录..."
    
    mkdir -p "$BACKEND_DIR/uploads"
    chmod 755 "$BACKEND_DIR/uploads"
    
    log_info "上传目录创建完成: $BACKEND_DIR/uploads"
}

# 启动服务
start_service() {
    log_step "启动后端服务..."
    
    cd "$BACKEND_DIR"
    
    # 停止旧服务
    pm2 stop zhonghui-api 2>/dev/null || true
    pm2 delete zhonghui-api 2>/dev/null || true
    
    # 启动新服务
    pm2 start index.js --name zhonghui-api
    
    # 保存进程列表
    pm2 save
    
    log_info "服务已启动"
}

# 验证服务
verify_service() {
    log_step "验证服务状态..."
    
    sleep 2
    
    # 检查 PM2 状态
    if pm2 list | grep -q "zhonghui-api"; then
        log_info "PM2 服务运行中"
    else
        log_error "PM2 服务未运行"
        return 1
    fi
    
    # 检查端口
    if netstat -tuln | grep -q ":3000"; then
        log_info "服务端口 3000 已监听"
    else
        log_warn "服务端口 3000 未监听"
    fi
    
    # 检查 API
    if curl -s http://localhost:3000/api/health | grep -q "ok"; then
        log_info "API 服务正常"
    else
        log_warn "API 服务可能未正常响应"
    fi
}

# 主函数
main() {
    echo "========================================"
    echo "  中汇企业官网 - 服务器部署脚本"
    echo "========================================"
    echo ""
    
    # 检查前置条件
    check_mysql || exit 1
    check_node || exit 1
    check_pm2 || exit 1
    
    # 部署步骤
    setup_database
    import_data
    setup_env
    install_dependencies
    setup_upload_dir
    start_service
    verify_service
    
    echo ""
    echo "========================================"
    echo "  部署完成!"
    echo "========================================"
    echo ""
    echo "服务管理命令:"
    echo "  查看状态: pm2 status"
    echo "  查看日志: pm2 logs zhonghui-api"
    echo "  重启服务: pm2 restart zhonghui-api"
    echo ""
    echo "API 地址: http://localhost:3000/api/"
    echo ""
}

# 执行主函数
main
