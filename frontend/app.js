const API_BASE = "https://fitness-tracker-restapi.onrender.com";

// Utilities
const getToken = () => localStorage.getItem('access_token');
const setToken = (token) => localStorage.setItem('access_token', token);
const removeToken = () => { localStorage.removeItem('access_token'); localStorage.removeItem('user_id'); };
const getUserId = () => localStorage.getItem('user_id');

// Common Headers
const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
});

// Navigation & Auth Flow
document.addEventListener('DOMContentLoaded', () => {
    // Determine which page we are on
    const isLoginPage = document.getElementById('loginForm') !== null;
    
    if (isLoginPage) {
        if (getToken()) { window.location.href = 'index.html'; }
        initAuthLogic();
    } else {
        if (!getToken()) { window.location.href = 'login.html'; }
        initDashboardLogic();
    }
});

// ============================================
// AUTHENTICATION LOGIC (login.html)
// ============================================
function initAuthLogic() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginPanel = document.getElementById('login-panel');
    const registerPanel = document.getElementById('register-panel');
    const loginError = document.getElementById('loginError');
    const regError = document.getElementById('regError');

    // Panel switching
    document.getElementById('showRegister').addEventListener('click', (e) => {
        e.preventDefault();
        loginPanel.classList.add('hidden');
        registerPanel.classList.remove('hidden');
    });

    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        registerPanel.classList.add('hidden');
        loginPanel.classList.remove('hidden');
    });

    // Login Submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const res = await fetch(`${API_BASE}/api/token/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) throw new Error("Invalid credentials");
            const data = await res.json();
            setToken(data.access);
            
            // Fetch users to find my ID simply by matching email.
            // (In a perfect backend, /api/token/ would return user details, but we'll fetch list)
            fetchUsersAndFindId(email);
            
        } catch (err) {
            loginError.classList.remove('hidden');
        }
    });

    // Registration Submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const payload = {
            username: document.getElementById('regUsername').value,
            password: document.getElementById('regPassword').value,
            email: document.getElementById('regEmail').value,
            first_name: document.getElementById('regFirstname').value,
            last_name: document.getElementById('regLastname').value,
            phonenumber: '0000000000' // mock since it's required in model
        };

        try {
            const res = await fetch(`${API_BASE}/users/user/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Creation failed");
            
            // Auto login
            document.getElementById('email').value = payload.email;
            document.getElementById('password').value = payload.password;
            document.getElementById('showLogin').click();
            loginForm.dispatchEvent(new Event('submit'));
            
        } catch (err) {
            regError.classList.remove('hidden');
        }
    });
}

function fetchUsersAndFindId(emailLogin) {
    fetch(`${API_BASE}/users/user/`)
    .then(r => r.json())
    .then(users => {
        const me = users.find(u => u.email === emailLogin);
        if(me) localStorage.setItem('user_id', me.id);
        window.location.href = 'index.html';
    });
}

// ============================================
// DASHBOARD LOGIC (index.html)
// ============================================
function initDashboardLogic() {
    // Set date input to today
    document.getElementById('actDate').valueAsDate = new Date();
    
    // Tab switching
    document.getElementById('nav-dashboard').addEventListener('click', (e) => {
        e.target.classList.add('active');
        document.getElementById('nav-workouts').classList.remove('active');
        document.getElementById('section-dashboard').classList.remove('hidden');
        document.getElementById('sidebar').classList.remove('hidden');
        document.getElementById('section-workouts').classList.add('hidden');
    });

    document.getElementById('nav-workouts').addEventListener('click', (e) => {
        e.target.classList.add('active');
        document.getElementById('nav-dashboard').classList.remove('active');
        document.getElementById('section-workouts').classList.remove('hidden');
        document.getElementById('section-dashboard').classList.add('hidden');
        document.getElementById('sidebar').classList.add('hidden');
        loadWorkouts();
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        removeToken();
        window.location.href = 'login.html';
    });

    // Load initial data
    loadUserInfo();
    loadDashboardData();

    // Log Activity Form
    document.getElementById('activityForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            user: parseInt(getUserId()),
            date: document.getElementById('actDate').value,
            steps_taken: parseInt(document.getElementById('actSteps').value),
            sleep_hours: parseFloat(document.getElementById('actSleep').value).toFixed(2),
            time_spent: document.getElementById('actTime').value
        };

        try {
            const res = await fetch(`${API_BASE}/activities/activity/`, {
                method: 'POST',
                headers: authHeaders(), // Needs Auth? Currently AllowAny on backend
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Failed to save");
            
            const msg = document.getElementById('actMsg');
            msg.innerHTML = "✅ Activity logged successfully!";
            msg.style.color = "var(--primary)";
            
            // Reload dashboard data
            loadDashboardData();
            
            setTimeout(() => { msg.innerHTML = "" }, 3000);
            e.target.reset();
            document.getElementById('actDate').valueAsDate = new Date();
        } catch(err) {
            console.error(err);
            alert("Failed to save activity");
        }
    });
}

async function loadUserInfo() {
    try {
        const id = getUserId();
        if(!id) return;
        const res = await fetch(`${API_BASE}/users/user/${id}/`);
        const user = await res.json();
        document.getElementById('userNameDisplay').textContent = user.first_name || user.username;
    } catch (err) {}
}

async function loadDashboardData() {
    try {
        const res = await fetch(`${API_BASE}/activities/activity/`);
        const allActs = await res.json();
        
        // 1. Process Leaderboard (Aggregate top steps by user)
        const userSteps = {}; // { "John Doe": 25000 }
        allActs.forEach(act => {
            const name = act.user_name || `Employee #${act.user}`; // relies on backend fix
            if(!userSteps[name]) userSteps[name] = 0;
            userSteps[name] += act.steps_taken;
        });
        
        const sortedLeaders = Object.entries(userSteps).sort((a,b) => b[1] - a[1]);
        
        const lbEl = document.getElementById('leaderboardList');
        lbEl.innerHTML = '';
        sortedLeaders.forEach((leader, idx) => {
            let rankClass = '';
            if(idx===0) rankClass = 'rank-1';
            if(idx===1) rankClass = 'rank-2';
            if(idx===2) rankClass = 'rank-3';
            
            const li = document.createElement('li');
            li.className = 'leaderboard-item';
            li.innerHTML = `
                <span><span class="${rankClass}">#${idx+1}</span> ${leader[0]}</span>
                <span style="font-weight: 600;">${leader[1].toLocaleString()} steps</span>
            `;
            lbEl.appendChild(li);
        });

        // 2. Personal Stats Processing
        const myId = parseInt(getUserId());
        const myActs = allActs.filter(a => a.user === myId);
        
        let totalSteps = 0, totalSleep = 0;
        myActs.forEach(a => {
            totalSteps += a.steps_taken;
            totalSleep += parseFloat(a.sleep_hours);
        });
        const avgSleep = myActs.length ? (totalSleep / myActs.length).toFixed(1) : 0;

        document.getElementById('userStatsGrid').innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${totalSteps.toLocaleString()}</div>
                <div class="stat-label">Total Steps</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${myActs.length}</div>
                <div class="stat-label">Days Logged</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${avgSleep}h</div>
                <div class="stat-label">Avg Sleep</div>
            </div>
        `;
        
    } catch(err) {
        console.error("Error loading dashboard data", err);
    }
}

async function loadWorkouts() {
    try {
        const res = await fetch(`${API_BASE}/workouts/workout/`);
        const workouts = await res.json();
        const container = document.getElementById('workoutsContainer');
        
        if(workouts.length === 0) {
            container.innerHTML = '<p class="text-muted">No workouts available right now.</p>';
            return;
        }

        let html = '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem;">';
        workouts.forEach(w => {
            html += `
                <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 1.5rem;">
                    <h3 style="color:var(--primary)">${w.name} <span style="font-size:0.8rem; background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 4px; float:right">${w.type}</span></h3>
                    <p class="text-muted" style="margin-bottom:1rem; font-size:0.9rem">${w.description}</p>
                    <p><strong>Duration:</strong> ${w.duration} mins</p>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
        
    } catch (err) {
        console.error("Failed to load workouts", err);
    }
}
