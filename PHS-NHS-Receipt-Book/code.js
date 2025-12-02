/* Dynamic menu + popup controller
   - Loads files/menu.csv (Category, [Items as array using | separator], Color)
   - Builds category buttons (color from CSV)
   - Clicking a category opens a popup showing items for that category (max 1 selection)
   - Bundle button opens a popup showing all items grouped by category (max 3 selections)
   - Login: stores cashier name and reveals the menu
*/

function parseCSVLine(line){
    // Basic CSV line parser handling quoted fields (double quotes) 
    const out = [];
    let cur = '';
    let inQuotes = false;
    for(let i=0;i<line.length;i++){
        const ch = line[i];
        if(ch === '"') { inQuotes = !inQuotes; continue; }
        if(ch === ',' && !inQuotes){ out.push(cur); cur=''; continue; }
        cur += ch;
    }
    out.push(cur);
    return out.map(s => s.trim());
}

document.addEventListener('DOMContentLoaded', () => {
    const buttonsRoot = document.getElementById('buttons');
    const bundleBtn = document.getElementById('bundleBtn');
    const loginEl = document.getElementById('login');
    const outterMenu = document.getElementById('outterMenu');

    // Always ask to login on load and do NOT persist any name across reloads
    // Keep cashier in memory only for this session/tab runtime
    let cashier = null;
    if (loginEl) loginEl.hidden = false;
    if (outterMenu) outterMenu.style.display = 'none';

    // Wire up login button if present
    if (loginEl) {
        const input = loginEl.querySelector('input[type=text]');
        const checkBtn = loginEl.querySelector('button');
        const greetingEl = document.getElementById('greeting');
        if (checkBtn) checkBtn.addEventListener('click', () => {
            const name = input && input.value ? input.value.trim() : '';
            if (!name) return;
            // DO NOT store name in localStorage/sessionStorage per request
            cashier = name;
            if (greetingEl) greetingEl.textContent = `Hello, ${name}!`;
            loginEl.hidden = true;
            outterMenu.style.display = '';
        });
    }

    // Load CSV and build menu (new format: Category, [item1|item2], color)
    fetch('menu.csv').then(r => r.text()).then(text => {
        const rows = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const header = parseCSVLine(rows.shift() || '');
        const data = {};
        rows.forEach(row => {
            const parts = parseCSVLine(row);
            const cat = parts[0] || '';
            let itemsField = parts[1] || '';
            const color = parts[2] || '';
            // remove surrounding brackets if present and any surrounding quotes
            itemsField = itemsField.replace(/^"|"$/g, '').trim();
            itemsField = itemsField.replace(/^\[|\]$/g,'').trim();
            const items = itemsField ? itemsField.split('|').map(s=>s.trim()).filter(Boolean) : [];
            if(!data[cat]) data[cat] = { color: color, items: [] };
            data[cat].items = items;
        });

        // build category buttons grouped into horizontal rows (2 per row)
        const cats = Object.keys(data);
        let row = null;
        cats.forEach((cat, i) => {
            if(i % 2 === 0){
                row = document.createElement('div');
                row.className = 'category-row';
                buttonsRoot.appendChild(row);
            }
            const entry = data[cat];
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.style.backgroundColor = entry.color || '#eee';
            btn.textContent = cat;
            btn.addEventListener('click', () => openCategoryPopup(cat, entry.items));
            row.appendChild(btn);
        });

        // move existing bundleBtn into its own centered row so layout is v-flex of h-flex rows
        const bundle = document.getElementById('bundleBtn');
        if(bundle){
            const bundleRow = document.createElement('div');
            bundleRow.className = 'category-row';
            bundleRow.style.justifyContent = 'center';
            bundleRow.appendChild(bundle);
            buttonsRoot.appendChild(bundleRow);
        }
    }).catch(err => console.error('Failed to load menu.csv', err));

    // bundle behavior: open a popup containing all categories/items, allow up to 3 selections
    if (bundleBtn) bundleBtn.addEventListener('click', openBundlePopup);
});

/* API stub: the app will prepare the message here; the actual sending
   will be handled by the user later. api_call returns a Promise that
   resolves with an object containing a random `output` value (1 or 2).
   The rest of the code treats output===1 as success and anything else
   as a simulated failure. */
async function api_call(text){
    const message = String(text);

    const options = {
        method: 'POST',
        headers: {
            Authorization: 'Bearer i7wYlQX96lUXmhPZnKgIvq1Q3ouYo2Xk9vdfI4BD',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({})
    };

    try{
        const url = 'https://api.groupme.com/v3/bots/post?bot_id=6eb53a0125b6ed5a930057de4c&text='+encodeURIComponent(message);
        console.log('api_call: POST', url);
        const res = await fetch(url, options);
        if(res.status === 202){
            console.log('api_call: GroupMe responded 202 Accepted');
            return true;
        }
        const body = await res.text();
        console.error('api_call: non-202 response', { status: res.status, body });
        return false;
    } catch(err){
        console.error('api_call: network/fetch error', err);
        return false;
    }
}

/* Helper: show an error message inside a popup (or create it) */
/* Helper: show an error message inside a popup (or create it)
   Accepts either a string or an Error-like object. If the error has
   .status or .body those will be shown to help debugging. */
function showPopupError(popup, messageOrError){
    if(!popup) return;
    let errEl = popup.querySelector('.popup-error');
    if(!errEl){
        errEl = document.createElement('div');
        errEl.className = 'popup-error';
        errEl.style.color = '#8B0000';
        errEl.style.marginTop = '0.6em';
        errEl.style.fontWeight = '600';
        errEl.style.whiteSpace = 'pre-wrap';
        popup.querySelector('.card-body').appendChild(errEl);
    }

    // Format the message for display
    if(!messageOrError) {
        errEl.textContent = 'Unknown error';
        return;
    }

    if(typeof messageOrError === 'string'){
        errEl.textContent = messageOrError;
        return;
    }

    // It's an object (likely Error)
    try{
        const e = messageOrError;
        let out = '';
        if(e.message) out += `Error: ${e.message}`;
        if(e.status) out += `\nStatus: ${e.status}`;
        if(e.body) out += `\nBody: ${e.body}`;
        // if no message produced, fallback to JSON
        if(!out) out = JSON.stringify(e, Object.getOwnPropertyNames(e), 2);
        errEl.textContent = out;
    } catch(ex){
        errEl.textContent = String(messageOrError);
    }
}

/* Helper: reset popup buttons (restore original text and enable) */
function resetPopupButtons(popup){
    if(!popup) return;
    const btns = popup.querySelectorAll('[data-action]');
    btns.forEach(b => {
        if(b.dataset && b.dataset.origText) b.textContent = b.dataset.origText;
        b.classList.remove('disabled');
        b.disabled = false;
    });
}

function openCategoryPopup(category, items){
    const root = document.getElementById('popup-root');
    if(!root) return;
    const id = `popup-${slug(category)}`;
    // remove any existing popup with same id
    const existing = document.getElementById(id);
    if(existing) existing.remove();

    const popup = document.createElement('div');
    popup.className = 'popup show';
    popup.id = id;
    popup.setAttribute('role','dialog');
    popup.setAttribute('aria-labelledby', id + '-title');

    popup.innerHTML = `
        <div class="card" role="document">
            <header class="card-header">
                <h2 id="${id}-title">${escapeHtml(category)}</h2>
                <button class="close" aria-label="Close">&times;</button>
            </header>
            <div class="card-body">
                <p style="margin-top:0;">Select one</p>
                <div class="items-list">
                    ${items.map((it, idx) => `
                        <label><input type="radio" name="${id}-choice" value="${escapeHtml(it)}"> ${escapeHtml(it)}</label>
                    `).join('')}
                </div>
                <div class="button-row">
                    <button class="btn--primary" data-action="submit">Add</button>
                    <button class="btn--secondary" data-action="cancel">Cancel</button>
                </div>
            </div>
        </div>
    `;

    root.appendChild(popup);

    // wire buttons
    popup.querySelector('.close').addEventListener('click', () => closePopup(id));
    popup.querySelector('[data-action="cancel"]').addEventListener('click', () => closePopup(id));
    popup.querySelector('[data-action="submit"]').addEventListener('click', (e) => {
        const sel = popup.querySelector(`input[name="${id}-choice"]:checked`);
        if(!sel) return alert('Please choose one item');
        // switch buttons to processing and store original text
        const btns = popup.querySelectorAll('[data-action]');
        btns.forEach(b => { b.dataset.origText = b.textContent; b.textContent = 'Processing...'; b.classList.add('disabled'); b.disabled = true; });

        // call API and handle success/error
        processItem(sel.value)
            .then(() => {
                showSuccessFlash();
                setTimeout(() => closePopup(id), 600);
            })
            .catch(err => {
                console.error('API error', err);
                // show the full error in the popup for testing (status/body/message)
                showPopupError(popup, err);
                resetPopupButtons(popup);
            });
    });

    // close on overlay click
    popup.addEventListener('click', (e) => { if(e.target === popup) closePopup(id); });
}

function openBundlePopup(){
    const root = document.getElementById('popup-root');
    if(!root) return;
    const id = 'popup-bundle';
    const existing = document.getElementById(id);
    if(existing) existing.remove();

    // rebuild items by reading menu.csv and parsing new array format
    fetch('menu.csv').then(r => r.text()).then(text => {
        const rows = text.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
        rows.shift();
        const groups = {};
        rows.forEach(row => {
            const parts = parseCSVLine(row);
            const cat = parts[0] || '';
            let itemsField = parts[1] || '';
            itemsField = itemsField.replace(/^"|"$/g, '').trim();
            itemsField = itemsField.replace(/^\[|\]$/g,'').trim();
            const items = itemsField ? itemsField.split('|').map(s=>s.trim()).filter(Boolean) : [];
            if(!groups[cat]) groups[cat] = [];
            items.forEach(it=> groups[cat].push(it));
        });

        const popup = document.createElement('div');
        popup.className = 'popup show';
        popup.id = id;
        popup.setAttribute('role','dialog');
        popup.setAttribute('aria-labelledby', id + '-title');

        let inner = `
            <div class="card" role="document">
                <header class="card-header">
                    <h2 id="${id}-title">Bundle (choose up to 3)</h2>
                    <button class="close" aria-label="Close">&times;</button>
                </header>
                <div class="card-body">
        `;

        Object.keys(groups).forEach(cat => {
            inner += `<h3 style="font-variant:small-caps; margin:0.5em 0 0.25em 0;">${escapeHtml(cat)}</h3>`;
            inner += '<div class="items-list">';
            groups[cat].forEach(it => {
                inner += `<label><input type="checkbox" name="bundle-choice" value="${escapeHtml(it)}"> ${escapeHtml(it)}</label>`;
            });
            inner += '</div>';
        });

        inner += `
                <div class="button-row">
                    <button class="btn--primary" data-action="submit">Add</button>
                    <button class="btn--secondary" data-action="cancel">Cancel</button>
                </div>
            </div>
        </div>`;

        popup.innerHTML = inner;
        root.appendChild(popup);

        popup.querySelector('.close').addEventListener('click', () => closePopup(id));
        popup.querySelector('[data-action="cancel"]').addEventListener('click', () => closePopup(id));
        // lock checkboxes when 3 are selected
        const bundleCheckboxes = popup.querySelectorAll('input[name="bundle-choice"]');
        function updateBundleCheckboxes(){
            const checked = popup.querySelectorAll('input[name="bundle-choice"]:checked');
            if(checked.length >= 3){
                bundleCheckboxes.forEach(cb => { if(!cb.checked) cb.disabled = true; });
            } else {
                bundleCheckboxes.forEach(cb => { cb.disabled = false; });
            }
        }
        bundleCheckboxes.forEach(cb => cb.addEventListener('change', updateBundleCheckboxes));

        popup.querySelector('[data-action="submit"]').addEventListener('click', () => {
            const checked = Array.from(popup.querySelectorAll('input[name="bundle-choice"]:checked')).map(i=>i.value);
            if(checked.length === 0) return alert('Please choose up to 3 items');
            if(checked.length > 3) return alert('You can only choose up to 3 items');
            // processing UI and store original text
            const btns = popup.querySelectorAll('[data-action]');
            btns.forEach(b => { b.dataset.origText = b.textContent; b.textContent = 'Processing...'; b.classList.add('disabled'); b.disabled = true; });

            processBundle(checked)
                .then(() => {
                    showSuccessFlash();
                    setTimeout(() => closePopup(id), 600);
                })
                .catch(err => {
                    console.error('API error', err);
                    // surface full error details in the popup so you can test quickly
                    showPopupError(popup, err);
                    resetPopupButtons(popup);
                });
        });

        popup.addEventListener('click', (e) => { if(e.target === popup) closePopup(id); });
    }).catch(err => console.error('Failed to load menu.csv for bundle', err));
}

function closePopup(id){
    const el = document.getElementById(id);
    if(!el) return;
    el.classList.remove('show');
    el.remove();
}

/* Placeholder processing functions — user will replace these with real API calls */
async function processItem(itemName){
    console.log('processItem: preparing message for:', itemName);
    const success = await api_call(itemName);
    if(success === true){
        console.log('processItem: api_call success');
        return true;
    }
    const err = new Error('API call failed');
    err.status = 500;
    throw err;
}

async function processBundle(items){
    console.log('processBundle: preparing bundle message for:', items);
    const text = 'Bundle: ' + items.join(', ');
    const success = await api_call(text);
    if(success === true){
        console.log('processBundle: api_call success');
        return true;
    }
    const err = new Error('API call failed');
    err.status = 500;
    throw err;
}

/* small util */
function slug(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
function escapeHtml(s){ return String(s).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

/* show a gentle green 'bloop' success flash across the screen */
function showSuccessFlash(){
    const id = 'success-flash';
    if (document.getElementById(id)) return; // already showing
    const el = document.createElement('div');
    el.id = id;
    el.className = 'success-flash';
    // disable all currently-enabled buttons so nothing can be clicked until cleared
    const buttons = Array.from(document.querySelectorAll('button'));
    buttons.forEach(b => {
        if (!b.disabled) {
            b.disabled = true;
            b.dataset._autoDisabled = '1';
        }
    });

    // add a centered white check element
    el.innerHTML = '<div class="success-check" role="status" aria-live="polite">\n        <svg viewBox="0 0 24 24" width="72" height="72" aria-hidden="true">\n          <path fill="#fff" d="M9.5 16.2L5.3 12l-1.4 1.4L9.5 19l11-11-1.4-1.4z"/>\n        </svg>\n      </div>';
    document.body.appendChild(el);
    // force a reflow then show (CSS transition)
    requestAnimationFrame(() => el.classList.add('show'));

    // keep the overlay until the user clicks anywhere; remove on first click/tap
    function removeOnClick(){
        el.classList.remove('show');
        // small delay to allow transition
        setTimeout(()=>{ try{ el.remove(); }catch(e){} }, 220);
        // re-enable buttons we auto-disabled
        const buttons = Array.from(document.querySelectorAll('button'));
        buttons.forEach(b => {
            if (b.dataset && b.dataset._autoDisabled === '1'){
                b.disabled = false;
                delete b.dataset._autoDisabled;
            }
        });
        document.removeEventListener('pointerdown', removeOnClick);
    }
    document.addEventListener('pointerdown', removeOnClick);
}
