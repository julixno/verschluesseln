function show(id) {
    document.querySelectorAll('.menu, .section-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

// Hilfsfunktionen für Krypto
const toHex = b => Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
const fromHex = h => new Uint8Array(h.match(/.{1,2}/g).map(x => parseInt(x, 16))).buffer;

document.getElementById('doGen').onclick = async () => {
    const key = await crypto.subtle.generateKey({name:"AES-CBC", length:256}, true, ["encrypt", "decrypt"]);
    const exp = await crypto.subtle.exportKey("raw", key);
    document.getElementById('outKey').value = toHex(exp);
};

document.getElementById('doEnc').onclick = async () => {
    const keyHex = document.getElementById('inKeyEnc').value;
    const msg = document.getElementById('msgEnc').value;
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const key = await crypto.subtle.importKey("raw", fromHex(keyHex), "AES-CBC", false, ["encrypt"]);
    const enc = await crypto.subtle.encrypt({name:"AES-CBC", iv}, key, new TextEncoder().encode(msg));
    document.getElementById('outEnc').value = toHex(iv) + toHex(enc);
};

document.getElementById('doDec').onclick = async () => {
    const keyHex = document.getElementById('inKeyDec').value;
    const full = document.getElementById('msgDec').value;
    const iv = fromHex(full.slice(0,32));
    const data = fromHex(full.slice(32));
    const key = await crypto.subtle.importKey("raw", fromHex(keyHex), "AES-CBC", false, ["decrypt"]);
    const dec = await crypto.subtle.decrypt({name:"AES-CBC", iv}, key, data);
    document.getElementById('outDec').value = new TextDecoder().decode(dec);
};