#!/bin/bash

# =============================================================================
# 中汇企业官网 - 后端部署脚本
# =============================================================================
# 功能：
#   1. 打包后端代码
#   2. 上传到远程服务器
#   3. 在远程服务器上安装依赖和启动服务
# =============================================================================

# 配置变量
SERVER_USER="root"                    # 服务器用户名
SERVER_HOST="www.chinaaupairs.com"    # 服务器地址
SERVER_PATH="/var/www/zhonghui"       # 远程服务器项目路径
LOCAL_PROJECT_PATH="$(cd "$(dirname "$0")" && pwd)/.."

# 后端目录
BACKEND_DIR="backend"
DIST_DIR="admin/dist"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "$1 命令未找到，请先安装"
        exit 1
    fi
}

# 创建部署包
create_package() {
    log_info "开始创建部署包..."
    
    # 创建临时目录
    TEMP_DIR="/tmp/zhonghui-deploy-$(date +%Y%m%d%H%M%S)"
    mkdir -p "$TEMP_DIR"
    
    # 复制后端代码
    log_info "复制后端代码..."
    cp -r "$LOCAL_PROJECT_PATH/$BACKEND_DIR" "$TEMP_DIR/"
    
    # 复制管理后台构建文件
    log_info "复制管理后台构建文件..."
    mkdir -p "$TEMP_DIR/$BACKEND_DIR/admin"
    cp -r "$LOCAL_PROJECT_PATH/$DIST_DIR" "$TEMP_DIR/$BACKEND_DIR/admin/"
    
    # 复制配置文件
    log_info "复制配置文件..."
    cp -r "$LOCAL_PROJECT_PATH/backend/config" "$TEMP_DIR/$BACKEND_DIR/"
    
    # 复制 Nginx 配置
    log_info "复制 Nginx 配置..."
    mkdir -p "$TEMP_DIR/config"
    cp "$LOCAL_PROJECT_PATH/nginx.conf" "$TEMP_DIR/config/"
    
    # 复制部署脚本
    log_info "复制部署脚本..."
    cp "$LOCAL_PROJECT_PATH/scripts/deploy-remote.sh" "$TEMP_DIR/"
    
    # 创建版本信息
    echo "Build Date: $(date)" > "$TEMP_DIR/version.txt"
    echo "Git Commit: $(git rev-parse HEAD 2>/dev/null || echo 'N/A')" >> "$TEMP_DIR/version.txt"
    echo "Git Branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'N/A')" >> "$TEMP_DIR/version.txt"
    
    # 打包
    PACKAGE_NAME="zhonghui-deploy-$(date +%Y%m%d).tar.gz"
    log_info "打包文件: $PACKAGE_NAME"
    tar -czf "$PACKAGE_NAME" -C "$(dirname "$TEMP_DIR")" "$(basename "$TEMP_DIR")"
    
    # 清理临时目录
    rm -rf "$TEMP_DIR"
    
    log_info "部署包创建完成: $PACKAGE_NAME"
    echo "$PACKAGE_NAME"
}

# 上传到远程服务器
upload_package() {
    local package_file="$1"
    
    log_info "上传部署包到服务器..."
    log_info "目标: $SERVER_USER@$SERVER_HOST:$SERVER_PATH"
    
    # 创建远程目录
    ssh "$SERVER_USER@$SERVER_HOST" "mkdir -p $SERVER_PATH"
    
    # 上传文件
    scp "$package_file" "$SERVER_USER@$SERVER_HOST:$SERVER_PATH/"
    
    log_info "上传完成"
}

# 在远程服务器上部署
deploy_remote() {
    local package_file=$(basename "$1")
    
    log_info "开始远程部署..."
    
    ssh "$SERVER_USER@$SERVER_HOST" << 'EOF'
set -e

SERVER_PATH="/var/www/zhonghui"
PACKAGE_FILE="$1"

echo "==== 开始部署 ====="

# 解压部署包
cd "$SERVER_PATH"
tar -xzf "$PACKAGE_FILE"

# 进入后端目录
cd "$SERVER_PATH/backend"

# 创建 .env 文件（如果不存在）
if [ ! -f .env ]; then
    echo "创建 .env 文件..."
    cat > .env << 'ENVEOF'
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YourPassword123!
DB_NAME=zhonghui
UPLOAD_DIR=./uploads
ENVEOF
fi

# 安装依赖
echo "安装后端依赖..."
npm install --production

# 创建上传目录
echo "创建上传目录..."
mkdir -p uploads
chmod 755 uploads

# 使用 PM2 启动服务
echo "启动后端服务..."
pm2 stop zhonghui-api 2>/dev/null || true
pm2 delete zhonghui-api 2>/dev/null || true
pm2 start index.js --name zhonghui-api
pm2 save

echo "==== 部署完成 ===="
EOF

    log_info "远程部署完成"
}

# 主函数
main() {
    echo "========================================"
    echo "  中汇企业官网 - 后端部署脚本"
    echo "========================================"
    echo ""
    
    # 检查命令
    check_command "ssh"
    check_command "scp"
    check_command "tar"
    
    # 检查 Git
    if [ -d ".git" ]; then
        log_info "Git 仓库检测到"
    else
        log_warn "未检测到 Git 仓库，跳过版本记录"
    fi
    
    # 创建部署包
    package_file=$(create_package)
    
    # 询问是否上传
    echo ""
    read -p "是否上传到服务器? (y/n): " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        upload_package "$package_file"
        
        # 询问是否部署
        echo ""
        read -p "是否在服务器上部署? (y/n): " confirm2
        if [ "$confirm2" = "y" ] || [ "$confirm2" = "Y" ]; then
            deploy_remote "$package_file"
        fi
    fi
    
    log_info "部署脚本执行完成"
}

# 执行主函数
main
