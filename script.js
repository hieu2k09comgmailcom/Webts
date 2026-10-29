
console.log("CTEAN3 - JavaScript đã kết nối!");

const cartKey = "ctean3_cart";
const pointsKey = "ctean3_points";
const completedOrdersKey = "ctean3_completed_orders";
const pendingOrderKey = "ctean3_pending_order";

let currentDiscountRate = 0;

// ================================
// QUẢN LÝ GIỎ HÀNG
// ================================

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(cartKey)) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(cartKey, JSON.stringify(cart));
}

// ================================
// QUẢN LÝ ĐIỂM THÀNH VIÊN
// ================================

function getPoints() {
    return Number(localStorage.getItem(pointsKey)) || 0;
}

function savePoints(points) {
    localStorage.setItem(pointsKey, String(points));
}

function getCompletedOrders() {
    try {
        return JSON.parse(
            localStorage.getItem(completedOrdersKey)
        ) || [];
    } catch {
        return [];
    }
}

function updatePointsDisplay() {
    const pointsElement =
        document.getElementById("loyalty-points");

    if (pointsElement) {
        pointsElement.textContent = getPoints();
    }
}

// ================================
// THÊM SẢN PHẨM TỪ MENU
// ================================

document.querySelectorAll(".menu-product-card").forEach((card) => {
    const button = card.querySelector("button");
    if (!button) return;

    button.addEventListener("click", () => {
        const name = card.querySelector("h3").innerText
            .replace(/\n/g, " ")
            .trim();

        const priceText = card.querySelector("p").innerText;
        const price = Number(priceText.replace(/[^\d]/g, ""));
        const image = card.querySelector("img").getAttribute("src");

        const cart = getCart();

        cart.push({
            id: Date.now() + Math.random(),
            name: name,
            price: price,
            image: image,
            selected: true
        });

        saveCart(cart);
        alert(name + " đã được thêm vào giỏ hàng!");
    });
});

// ================================
// HIỂN THỊ GIỎ HÀNG
// ================================

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    if (!cartItems) return;

    const cart = getCart();
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML =
            "<p>Bạn chưa chọn món nào. Hãy quay lại Menu để chọn nhé!</p>";

        updateTotal();
        return;
    }

    cart.forEach((item) => {
        const row = document.createElement("div");
        row.className = "cart-item";

        const label = document.createElement("label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "cart-checkbox";
        checkbox.dataset.id = String(item.id);
        checkbox.checked = item.selected;

        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name;

        const name = document.createElement("span");
        name.textContent = item.name;

        const price = document.createElement("strong");
        price.textContent =
            item.price.toLocaleString("vi-VN") + "đ";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-cart-item";
        deleteButton.dataset.id = String(item.id);
        deleteButton.textContent = "Xóa";

        label.append(checkbox, img, name);
        row.append(label, price, deleteButton);
        cartItems.appendChild(row);
    });

    updateTotal();
}

// ================================
// TÍNH TỔNG TIỀN
// ================================

function calculateTotal() {
    const selectedItems = getCart().filter(
        item => item.selected
    );

    const subtotal = selectedItems.reduce(
        (sum, item) => sum + Number(item.price),
        0
    );

    const discount = Math.round(
        subtotal * currentDiscountRate
    );

    return {
        selectedItems,
        subtotal,
        discount,
        total: subtotal - discount
    };
}

function updateTotal() {
    const { discount, total } = calculateTotal();

    const totalElement =
        document.getElementById("cart-total");

    if (totalElement) {
        totalElement.textContent =
            total.toLocaleString("vi-VN") + "đ";
    }

    const discountElement =
        document.getElementById("discount-amount");

    if (discountElement) {
        discountElement.textContent =
            discount.toLocaleString("vi-VN") + "đ";
    }
}

// ================================
// CHỌN / BỎ CHỌN MÓN
// ================================

document.addEventListener("change", (event) => {
    if (!event.target.matches(".cart-checkbox")) return;

    const cart = getCart();

    const item = cart.find(
        product =>
            String(product.id) === event.target.dataset.id
    );

    if (item) {
        item.selected = event.target.checked;
        saveCart(cart);
        updateTotal();
    }
});

// ================================
// XÓA MÓN KHỎI GIỎ
// ================================

document.addEventListener("click", (event) => {
    const button = event.target.closest(".delete-cart-item");
    if (!button) return;

    const id = button.dataset.id;

    const cart = getCart().filter(
        item => String(item.id) !== id
    );

    saveCart(cart);
    renderCart();
});

// ================================
// ÁP DỤNG VOUCHER
// ================================

const applyVoucherButton =
    document.getElementById("apply-voucher");

if (applyVoucherButton) {
    applyVoucherButton.addEventListener("click", () => {
        const input =
            document.getElementById("voucher-code");

        const message =
            document.getElementById("voucher-message");

        const code = input.value.trim().toUpperCase();

        const vouchers = {
            "NHOM5SIGMA": 0.36,
            "12TI5": 0.18
        };

        if (code === "") {
            currentDiscountRate = 0;
            message.textContent = "Nhập voucher trước nha!";
        } else if (vouchers[code] !== undefined) {
            currentDiscountRate = vouchers[code];

            message.textContent =
                "Áp dụng thành công! Giảm " +
                (currentDiscountRate * 100) + "%.";
        } else {
            currentDiscountRate = 0;
            message.textContent = "Mã không hợp lệ!";
        }

        updateTotal();
    });
}

// ================================
// TẠO NÚT XÁC NHẬN THANH TOÁN
// ================================

function getOrCreateConfirmButton(qrSection) {
    let button = document.getElementById(
        "confirm-payment-button"
    );

    if (!button) {
        button = document.createElement("button");
        button.id = "confirm-payment-button";
        button.type = "button";
        button.textContent =
            "Xác nhận thanh toán thành công";

        qrSection.appendChild(button);
    }

    return button;
}

// ================================
// THANH TOÁN VÀ HIỂN THỊ QR
// ================================

const checkoutButton =
    document.getElementById("checkout-button");

if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
        const { selectedItems, total } = calculateTotal();

        if (selectedItems.length === 0) {
            alert("Chọn ít nhất một ngôn ngữ lập trình trước khi thanh toán nha!");
            return;
        }

        const qrSection =
            document.getElementById("qr-section");

        const qrImage =
            document.getElementById("payment-qr");

        if (!qrSection || !qrImage) {
            alert("Không tìm thấy khu vực hiển thị QR!");
            return;
        }

        // Tạo mã đơn và giữ nguyên mã nếu đơn đang chờ
        // vẫn có cùng danh sách món và tổng tiền.
        const itemIds = selectedItems.map(item => String(item.id));

        let pendingOrder = null;

        try {
            pendingOrder = JSON.parse(
                sessionStorage.getItem(pendingOrderKey)
            );
        } catch {
            pendingOrder = null;
        }

        const sameItems =
            pendingOrder &&
            Array.isArray(pendingOrder.itemIds) &&
            JSON.stringify([...pendingOrder.itemIds].sort()) ===
                JSON.stringify([...itemIds].sort());

        if (
            !sameItems ||
            pendingOrder.total !== total ||
            !pendingOrder.id
        ) {
            pendingOrder = {
                id: "CTEAN3-" + Date.now() + "-" +
                    Math.random().toString(36).slice(2, 8),
                total: total,
                itemIds: itemIds
            };

            sessionStorage.setItem(
                pendingOrderKey,
                JSON.stringify(pendingOrder)
            );
        }

        // QR này chỉ chứa thông tin đơn hàng mô phỏng, không thực hiện giao dịch ngân hàng.
        const demoPaymentInfo =
            "CTEAN3 - THANH TOAN MO PHONG" +
            " | Ma don: " + pendingOrder.id +
            " | Tong tien: " + total.toLocaleString("vi-VN") + " VND" +
            " | Khong phai giao dich ngan hang.";

        qrImage.src =
            "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" +
            encodeURIComponent(demoPaymentInfo);

        qrSection.hidden = false;

        // Tạo vùng thông báo kết quả nếu chưa có
        let paymentMessage =
            document.getElementById("payment-message");

        if (!paymentMessage) {
            paymentMessage = document.createElement("p");
            paymentMessage.id = "payment-message";
            paymentMessage.setAttribute("aria-live", "polite");
            qrSection.appendChild(paymentMessage);
        }

        paymentMessage.textContent =
            "Tổng thanh toán: " +
            total.toLocaleString("vi-VN") +
            "đ. Đây là thanh toán mô phỏng.";

        const confirmButton =
            getOrCreateConfirmButton(qrSection);

        confirmButton.disabled = false;
        confirmButton.textContent =
            "Xác nhận thanh toán thành công";

        // ================================
        // XÁC NHẬN HOÀN TẤT ĐƠN
        // ================================

        confirmButton.onclick = () => {
            let currentOrder = null;

            try {
                currentOrder = JSON.parse(
                    sessionStorage.getItem(pendingOrderKey)
                );
            } catch {
                currentOrder = null;
            }

            if (
                !currentOrder ||
                currentOrder.id !== pendingOrder.id
            ) {
                paymentMessage.textContent =
                    "Không tìm thấy đơn hàng đang chờ xác nhận.";
                return;
            }

            const completedOrders = getCompletedOrders();

            // Chặn cộng điểm lần thứ hai cho cùng mã đơn
            if (completedOrders.includes(currentOrder.id)) {
                paymentMessage.textContent =
                    "Đơn hàng này đã được xử lý trước đó.";
                return;
            }

            // Đánh dấu đơn đã hoàn tất
            completedOrders.push(currentOrder.id);

            localStorage.setItem(
                completedOrdersKey,
                JSON.stringify(completedOrders)
            );


            // Tính điểm: mỗi 50.000đ được 5 điểm
            const earnedPoints =
                Math.floor(currentOrder.total / 50000) * 5;

            if (earnedPoints > 0) {
                savePoints(getPoints() + earnedPoints);

                paymentMessage.textContent =
                    `Thanh toán mô phỏng hoàn tất! Bạn được cộng ${earnedPoints} điểm thành viên.`;
            } else {
                paymentMessage.textContent =
                    "Thanh toán mô phỏng hoàn tất! Đơn hàng chưa đạt 50.000đ nên không được cộng điểm.";
            }


            // Xóa những món thuộc đơn vừa xác nhận
            const purchasedIds = currentOrder.itemIds;

            const remainingCart = getCart().filter(item =>
                !purchasedIds.includes(String(item.id))
            );

            saveCart(remainingCart);

            // Xóa đơn chờ để chuẩn bị cho đơn mới
            sessionStorage.removeItem(pendingOrderKey);

           confirmButton.disabled = true;
		   confirmButton.textContent = "✓ Đã xác nhận thanh toán";

            renderCart();
            updatePointsDisplay();
        };
        qrSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
}

// ================================
// KHỞI TẠO
// ================================

renderCart();
updatePointsDisplay();
