// ========== DỮ LIỆU LƯU TRỮ TRÌNH DUYỆT ==========
let taiKhoanHienTai = null;
let danhSachTaiKhoan = JSON.parse(localStorage.getItem("dsTaiKhoan") || "{}");
let danhSachLichSu = JSON.parse(localStorage.getItem("lichSuHeThong") || "[]");
let yeuCauAdmin = JSON.parse(localStorage.getItem("dsYeuCauAdmin") || "[]");
const ADMIN_USER = "PHUONGVY2012TRUNGSANG20108386";
const ADMIN_PASS = "PHUONGVY2012TRUNGSANG20108386"; // Mật khẩu ẩn trên giao diện

// ========== CHUYỂN TAB ĐĂNG NHẬP/ĐĂNG KÝ ==========
document.getElementById("loginTab").addEventListener("click", () => {
    document.getElementById("loginTab").classList.add("active");
    document.getElementById("registerTab").classList.remove("active");
    document.getElementById("loginForm").classList.add("active");
    document.getElementById("registerForm").classList.remove("active");
});
document.getElementById("registerTab").addEventListener("click", () => {
    document.getElementById("registerTab").classList.add("active");
    document.getElementById("loginTab").classList.remove("active");
    document.getElementById("registerForm").classList.add("active");
    document.getElementById("loginForm").classList.remove("active");
});

// ========== CHỨC NĂNG ĐĂNG KÝ ==========
function dangKyTaiKhoan() {
    const ten = document.getElementById("regUser").value.trim();
    const matKhau = document.getElementById("regPass").value.trim();
    if (!ten || !matKhau) return alert("❌ Điền đầy đủ thông tin!");
    if (danhSachTaiKhoan[ten]) return alert("❌ Tên tài khoản đã tồn tại! Chọn tên khác.");
    
    danhSachTaiKhoan[ten] = { matKhau, soDu: 0 };
    localStorage.setItem("dsTaiKhoan", JSON.stringify(danhSachTaiKhoan));
    ghiLichSu("Hệ thống", `✅ Tạo tài khoản mới: ${ten}`, "tài khoản");
    alert("✅ Đăng ký thành công! Hãy đăng nhập để sử dụng.");
    document.getElementById("loginTab").click();
    document.getElementById("regUser").value = "";
    document.getElementById("regPass").value = "";
}

// ========== CHỨC NĂNG ĐĂNG NHẬP ==========
function dangNhap() {
    const ten = document.getElementById("loginUser").value.trim();
    const matKhau = document.getElementById("loginPass").value.trim();
    if (!ten || !matKhau) return alert("❌ Điền đầy đủ thông tin!");
    if (!danhSachTaiKhoan[ten] || danhSachTaiKhoan[ten].matKhau !== matKhau) return alert("❌ Tên tài khoản hoặc mật khẩu sai!");

    taiKhoanHienTai = ten;
    document.getElementById("authBox").style.display = "none";
    document.getElementById("mainUI").style.display = "block";
    document.getElementById("tenHienThi").textContent = ten;
    capNhatSoDu();
    ghiLichSu(ten, "🔑 Đăng nhập vào hệ thống thành công", "tài khoản");
}

// ========== ĐĂNG XUẤT ==========
function dangXuat() {
    if (!confirm("Bạn chắc chắn muốn đăng xuất?")) return;
    taiKhoanHienTai = null;
    document.getElementById("authBox").style.display = "block";
    document.getElementById("mainUI").style.display = "none";
    document.getElementById("loginUser").value = "";
    document.getElementById("loginPass").value = "";
}

// ========== CẬP NHẬT SỐ DƯ ==========
function capNhatSoDu() {
    document.getElementById("soDu").textContent = danhSachTaiKhoan[taiKhoanHienTai]?.soDu?.toLocaleString("vi-VN") || 0;
}

// ========== MUA PROXY ==========
function tangSoLuong() {
    const sl = document.getElementById("soLuong");
    if (+sl.value < 99) sl.value = +sl.value + 1;
}
function giamSoLuong() {
    const sl = document.getElementById("soLuong");
    if (+sl.value > 1) sl.value = +sl.value - 1;
}
function xacNhanMuaProxy() {
    const gia = +document.getElementById("loaiProxy").value;
    const sl = +document.getElementById("soLuong").value;
    const tongTien = gia * sl;
    if (danhSachTaiKhoan[taiKhoanHienTai].soDu < tongTien) return alert("❌ Số dư không đủ! Nạp tiền trước nhé.");
    
    danhSachTaiKhoan[taiKhoanHienTai].soDu -= tongTien;
    localStorage.setItem("dsTaiKhoan", JSON.stringify(danhSachTaiKhoan));
    capNhatSoDu();
    const yeuCau = {
        nguoi: taiKhoanHienTai, loai: "Mua Proxy", soLuong: sl, tien: tongTien,
        trangThai: "Chờ Admin cấp key", thoiGian: new Date().toLocaleString("vi-VN")
    };
    yeuCauAdmin.push(yeuCau);
    localStorage.setItem("dsYeuCauAdmin", JSON.stringify(yeuCauAdmin));
    ghiLichSu(taiKhoanHienTai, `🛒 Mua Proxy x${sl} - Trừ tiền: ${tongTien.toLocaleString()} VNĐ`, "mua hàng");
    document.getElementById("keyNhan").innerHTML = `<p>✅ Đã gửi yêu cầu! Chờ 1-10 phút nhận key tại đây</p>`;
    alert("✅ Đã xác nhận mua! Hệ thống đã gửi yêu cầu đến Admin.");
}

// ========== HIỆN MÃ QR NẠP TIỀN ==========
function hienMaQR() {
    const tien = +document.getElementById("tienChuyen").value;
    if (tien < 40000) return alert("❌ Tối thiểu nạp 40.000 VNĐ!");
    window.open("qr-payment.html?amount=" + tien, "_blank", "width=400,height=600");
    yeuCauAdmin.push({
        nguoi: taiKhoanHienTai, loai: "Nạp chuyển khoản", tien: tien,
        trangThai: "Chờ xác nhận", thoiGian: new Date().toLocaleString("vi-VN")
    });
    localStorage.setItem("dsYeuCauAdmin", JSON.stringify(yeuCauAdmin));
    ghiLichSu(taiKhoanHienTai, `💸 Yêu cầu nạp chuyển khoản: ${tien.toLocaleString()} VNĐ`, "nạp tiền");
}

// ========== NẠP THẺ CÀO ==========
function xacNhanNapThe() {
    const loai = document.getElementById("loaiThe").value;
    const gia = +document.getElementById("menhGiaThe").value;
    if (gia < 40000) return alert("❌ Tối thiểu nạp 40.000 VNĐ!");
    yeuCauAdmin.push({
        nguoi: taiKhoanHienTai, loai: `Nạp thẻ ${loai}`, tien: gia,
        trangThai: "Chờ xác nhận", thoiGian: new Date().toLocaleString("vi-VN")
    });
    localStorage.setItem("dsYeuCauAdmin", JSON.stringify(yeuCauAdmin));
    ghiLichSu(taiKhoanHienTai, `💳 Yêu cầu nạp thẻ ${loai} - ${gia.toLocaleString()} VNĐ`, "nạp tiền");
    alert("✅ Đã gửi yêu cầu! Admin sẽ xử lý sớm nhất.");
}

// ========== KHU ADMIN ==========
function moKhuAdmin() { document.getElementById("adminBox").style.display = "flex"; }
function dongKhuAdmin() { document.getElementById("adminBox").style.display = "none"; }
function kiemTraAdmin() {
    const u = document.getElementById("adminUser").value;
    const p = document.getElementById("adminPass").value;
    if (u === ADMIN_USER && p === ADMIN_PASS) {
        document.getElementById("admin-login-form").style.display = "none";
        document.getElementById("adminNoiDung").style.display = "block";
        hienThiYeuCauAdmin();
    } else alert("❌ Thông tin Admin không đúng!");
}
function hienThiYeuCauAdmin() {
    const khung = document.getElementById("yeuCauAdmin");
    khung.innerHTML = yeuCauAdmin.length ? "" : "<p>Không có yêu cầu nào</p>";
    yeuCauAdmin.forEach((yc, i) => {
        khung.innerHTML += `
        <div style="background:rgba(255,255,255,0.1);padding:10px;margin:8px 0;border-radius:6px;">
            <p>Người dùng: ${yc.nguoi}</p>
            <p>Loại: ${yc.loai} | Tiền: ${yc.tien?.toLocaleString()||"-"} | Thời gian: ${yc.thoiGian}</p>
            <input placeholder="Nhập Key / Xác nhận nạp tiền" id="key${i}">
            <button onclick="xuLyYeuCau(${i})">✅ Xử lý & Gửi</button>
        </div>`;
    });
}
function xuLyYeuCau(index) {
    const key = document.getElementById(`key${index}`).value;
    const yc = yeuCauAdmin[index];
    if (yc.loai.includes("Nạp")) {
        danhSachTaiKhoan[yc.nguoi].soDu += yc.tien;
        ghiLichSu(yc.nguoi, `✅ Đã nạp thành công: ${yc.tien.toLocaleString()} VNĐ`, "nhận tiền");
    } else {
        ghiLichSu(yc.nguoi, `🔑 Đã nhận key: ${key}`, "nhận key");
    }
    yeuCauAdmin.splice(index,1);
    localStorage.setItem("dsTaiKhoan", JSON.stringify(danhSachTaiKhoan));
    localStorage.setItem("dsYeuCauAdmin", JSON.stringify(yeuCauAdmin));
    capNhatSoDu();
    hienThiYeuCauAdmin();
    alert("✅ Đã xử lý xong!");
}

// ========== GHI LỊCH SỬ ==========
function ghiLichSu(nguoi, noiDung, loai) {
    danhSachLichSu.unshift({
        nguoi, noiDung, loai, thoiGian: new Date().toLocaleString("vi-VN")
    });
    localStorage.setItem("lichSuHeThong", JSON.stringify(danhSachLichSu));
    hienThiLichSu();
}
function hienThiLichSu() {
    const khung = document.getElementById("danhSachLichSu");
    khung.innerHTML = danhSachLichSu.length ? "" : "<p>Chưa có hoạt động nào</p>";
    danhSachLichSu.forEach(ls => {
        khung.innerHTML += `<p>[${ls.thoiGian}] <strong>${ls.nguoi}</strong>: ${ls.noiDung}</p>`;
    });
}
// Hiển thị lịch sử khi tải trang
hienThiLichSu();