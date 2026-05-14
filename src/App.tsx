import React, { useEffect, useMemo, useRef, useState } from "react";

type Role = "borrower" | "manager";

type User = {
  name: string;
  email: string;
  role: Role;
  reputation: number;
};

type Equipment = {
  id: number;
  name: string;
  category: string;
  status: "Còn" | "Hết";
  icon: string;
  quantity: number;
  zone: string;
};

const equipmentData: Equipment[] = [
  {
    id: 1,
    name: "Loa JBL PartyBox",
    category: "Âm thanh",
    status: "Còn",
    icon: "🔊",
    quantity: 2,
    zone: "A1",
  },
  {
    id: 2,
    name: "Micro không dây",
    category: "Âm thanh",
    status: "Còn",
    icon: "🎤",
    quantity: 8,
    zone: "A2",
  },
  {
    id: 3,
    name: "Đèn Par LED",
    category: "Ánh sáng",
    status: "Còn",
    icon: "💡",
    quantity: 12,
    zone: "B1",
  },
  {
    id: 4,
    name: "Backdrop CLB",
    category: "Trang trí",
    status: "Hết",
    icon: "🎨",
    quantity: 1,
    zone: "C1",
  },
  {
    id: 5,
    name: "Máy chiếu Epson",
    category: "Kỹ thuật",
    status: "Còn",
    icon: "📽️",
    quantity: 3,
    zone: "D1",
  },
  {
    id: 6,
    name: "Bàn gấp",
    category: "Nội thất",
    status: "Còn",
    icon: "🪑",
    quantity: 20,
    zone: "E1",
  },
  {
    id: 7,
    name: "Ghế nhựa",
    category: "Nội thất",
    status: "Còn",
    icon: "💺",
    quantity: 100,
    zone: "E2",
  },
  {
    id: 8,
    name: "Dây điện nối dài",
    category: "Kỹ thuật",
    status: "Còn",
    icon: "🔌",
    quantity: 15,
    zone: "D2",
  },
];

export default function BAEquipmentSystem() {
  const [screen, setScreen] = useState<"login" | "register" | "app">("login");
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(
    () =>
      equipmentData.filter((i) =>
        `${i.name} ${i.category}`.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const login = (role: Role) => {
    setUser({
      name: role === "manager" ? "Ban Quản Lý CLB" : "Sinh viên BA",
      email: role === "manager" ? "manager@hvnh.edu.vn" : "student@hvnh.edu.vn",
      role,
      reputation: 96,
    });
    setScreen("app");
  };

  if (screen === "login") {
    return (
      <AuthPage>
        <Logo />
        <h2>Đăng nhập hệ thống</h2>
        <p style={styles.muted}>
          Hệ thống quản lý mượn trả thiết bị dành cho sinh viên Học viện Ngân
          hàng
        </p>
        <input
          style={styles.input}
          placeholder="Email"
          defaultValue="student@hvnh.edu.vn"
        />
        <input
          style={styles.input}
          placeholder="Mật khẩu"
          type="password"
          defaultValue="123456"
        />
        <button style={styles.primaryButton} onClick={() => login("borrower")}>
          Đăng nhập với vai trò Người mượn
        </button>
        <button style={styles.secondaryButton} onClick={() => login("manager")}>
          Đăng nhập với vai trò Quản lý
        </button>
        <button style={styles.linkButton} onClick={() => setScreen("register")}>
          Chưa có tài khoản? Đăng ký
        </button>
      </AuthPage>
    );
  }

  if (screen === "register") {
    return (
      <AuthPage>
        <Logo />
        <h2>Đăng ký tài khoản</h2>
        <input style={styles.input} placeholder="Họ và tên" />
        <input style={styles.input} placeholder="Email sinh viên" />
        <input style={styles.input} placeholder="Mật khẩu" type="password" />
        <select style={styles.input}>
          <option>Người mượn</option>
          <option>Người quản lý</option>
        </select>
        <button style={styles.primaryButton} onClick={() => login("borrower")}>
          Tạo tài khoản
        </button>
        <button style={styles.linkButton} onClick={() => setScreen("login")}>
          Quay lại đăng nhập
        </button>
      </AuthPage>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Logo small />
        <div>
          <div style={{ fontWeight: 700 }}>{user?.name}</div>
          <div style={styles.muted}>
            {user?.role === "manager" ? "👨‍💼 Người quản lý" : "🎓 Người mượn"}
          </div>
        </div>
        <button style={styles.logoutButton} onClick={() => setScreen("login")}>
          Thoát
        </button>
      </div>

      {user?.role === "manager" ? (
        <ManagerPanel />
      ) : (
        <BorrowerPanel reputation={user?.reputation || 96} />
      )}

      <CameraScanner />

      <div style={styles.card}>
        <h3>🔍 Tìm kiếm thiết bị</h3>
        <input
          style={styles.input}
          placeholder="Tìm loa, bàn, ghế, máy chiếu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredItems.map((item) => (
        <div key={item.id} style={styles.card}>
          <h3>
            {item.icon} {item.name}
          </h3>
          <p>
            <b>Danh mục:</b> {item.category}
          </p>
          <p>
            <b>Số lượng:</b> {item.quantity}
          </p>
          <p>
            <b>Vị trí kho:</b> Zone {item.zone}
          </p>
          <p>
            <b>Trạng thái:</b>{" "}
            <span
              style={{
                color: item.status === "Còn" ? "green" : "red",
                fontWeight: 700,
              }}
            >
              {item.status}
            </span>
          </p>
          {user?.role === "borrower" && item.status === "Còn" && (
            <>
              <input type="datetime-local" style={styles.input} />
              <input type="datetime-local" style={styles.input} />
              <button style={styles.primaryButton}>Đặt mượn</button>
            </>
          )}
          {user?.role === "manager" && (
            <button style={styles.secondaryButton}>Cập nhật thiết bị</button>
          )}
        </div>
      ))}
    </div>
  );
}

function Logo({ small = false }: { small?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: small ? 0 : 12,
      }}
    >
      <div
        style={{
          width: small ? 42 : 64,
          height: small ? 42 : 64,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#005BAC,#F58220)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 800,
          fontSize: small ? 14 : 20,
        }}
      >
        BA
      </div>
      {!small && (
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: "#005BAC" }}>
            BA EQUIP
          </div>
          <div style={{ color: "#F58220", fontSize: 12 }}>
            Banking Academy Equipment System
          </div>
        </div>
      )}
    </div>
  );
}

function AuthPage({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.authPage}>
      <div style={styles.authCard}>{children}</div>
    </div>
  );
}

function BorrowerPanel({ reputation }: { reputation: number }) {
  return (
    <div style={styles.card}>
      <h3>⭐ Điểm tín nhiệm</h3>
      <div style={{ fontSize: 36, fontWeight: 800, color: "#005BAC" }}>
        {reputation}/100
      </div>
      <p style={styles.muted}>
        Nhắc trả tự động qua Zalo và Email trước 2 giờ.
      </p>
    </div>
  );
}

function ManagerPanel() {
  return (
    <div style={styles.card}>
      <h3>📊 Bảng điều khiển quản lý</h3>
      <p>Thiết bị trong kho: 8 loại</p>
      <p>Tổng số ghế: 100</p>
      <p>Yêu cầu chờ duyệt: 3</p>
      <button style={styles.primaryButton}>Quản lý kho & Duyệt đơn</button>
    </div>
  );
}

function CameraScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch(() =>
        alert("Không thể truy cập camera. Hãy cấp quyền cho trình duyệt.")
      );
  }, [started]);

  return (
    <div style={styles.card}>
      <h3>📷 Quét mã QR Category</h3>
      {!started ? (
        <button style={styles.primaryButton} onClick={() => setStarted(true)}>
          Mở Camera
        </button>
      ) : (
        <video
          ref={videoRef}
          style={{ width: "100%", borderRadius: 12 }}
          muted
        />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  authPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg,#005BAC,#F58220)",
    padding: 20,
    fontFamily: "Arial, sans-serif",
  },
  authCard: {
    background: "white",
    padding: 28,
    borderRadius: 24,
    maxWidth: 420,
    width: "100%",
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
  },
  page: {
    minHeight: "100vh",
    background: "#f4f8fc",
    padding: 16,
    maxWidth: 480,
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    background: "white",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  card: {
    background: "white",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #dbe4ee",
    boxSizing: "border-box",
    marginBottom: 10,
  },
  primaryButton: {
    width: "100%",
    padding: 12,
    background: "#F58220",
    color: "white",
    border: "none",
    borderRadius: 10,
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    width: "100%",
    padding: 12,
    background: "#005BAC",
    color: "white",
    border: "none",
    borderRadius: 10,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 8,
  },
  linkButton: {
    background: "transparent",
    border: "none",
    color: "#005BAC",
    marginTop: 12,
    cursor: "pointer",
    width: "100%",
  },
  logoutButton: {
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
  },
  muted: {
    color: "#64748b",
    fontSize: 13,
  },
};
