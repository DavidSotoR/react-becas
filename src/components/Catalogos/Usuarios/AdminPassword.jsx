import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPassword({ userId, onSaved }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [visible, setVisible] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const api = process.env.REACT_APP_API_URL;

    useEffect(() => {
        let active = true;
        setIsAdmin(false);
        setPassword("");
        setConfirmation("");
        setVisible(false);
        setMessage(null);
        axios.post(`${api}/me`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }).then(({ data }) => {
            if (active) setIsAdmin(Number(data.id_perfil) === 1);
        }).catch(() => {
            if (active) setIsAdmin(false);
        });
        return () => { active = false; };
    }, [api, userId]);

    const generate = () => {
        const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
        const randomIndex = (length) => {
            const bytes = new Uint8Array(1);
            do { window.crypto.getRandomValues(bytes); }
            while (bytes[0] >= 256 - (256 % length));
            return bytes[0] % length;
        };
        let generated;
        do {
            generated = Array.from({ length: 16 }, () => alphabet[randomIndex(alphabet.length)]).join('');
        } while (!/[A-Z]/.test(generated) || !/[a-z]/.test(generated) || !/\d/.test(generated));
        setPassword(generated);
        setConfirmation(generated);
        setVisible(true);
        setMessage(null);
    };

    const save = async () => {
        if (!isAdmin || saving) return;
        if (password.length < 6 || password.length > 20 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || /\s/.test(password)) {
            setMessage({ type: 'danger', text: 'Usa entre 6 y 20 caracteres, mayúsculas, minúsculas y números, sin espacios.' });
            return;
        }
        if (password !== confirmation) {
            setMessage({ type: 'danger', text: 'Las contraseñas no coinciden.' });
            return;
        }
        setSaving(true);
        setMessage(null);
        try {
            await axios.put(`${api}/usuarios/${userId}/admin-password`, {
                password, password_confirmation: confirmation,
            }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setPassword('');
            setConfirmation('');
            setVisible(false);
            setMessage({ type: 'success', text: 'Contraseña actualizada correctamente.' });
            onSaved();
        } catch (error) {
            if ([401, 403].includes(error.response?.status)) setIsAdmin(false);
            setMessage({ type: 'danger', text: error.response?.data?.message || 'No se pudo actualizar la contraseña. Intenta nuevamente.' });
        } finally {
            setSaving(false);
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="col-12 mb-3">
            <fieldset className="border rounded p-3" disabled={saving || !userId}>
                <legend className="float-none w-auto fs-6 fw-bold">Cambiar contraseña</legend>
                <p className="text-muted">Escribe una nueva contraseña o genera una. Se guardará únicamente al pulsar Guardar contraseña.</p>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="admin-password" className="form-label">Nueva contraseña</label>
                        <input id="admin-password" className="form-control" type={visible ? 'text' : 'password'} autoComplete="new-password" value={password} maxLength={20} onChange={(e) => setPassword(e.target.value)} aria-describedby="admin-password-help" />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="admin-password-confirmation" className="form-label">Confirmar contraseña</label>
                        <input id="admin-password-confirmation" className="form-control" type={visible ? 'text' : 'password'} autoComplete="new-password" value={confirmation} maxLength={20} onChange={(e) => setConfirmation(e.target.value)} />
                    </div>
                </div>
                <p id="admin-password-help" className="text-muted small">6 a 20 caracteres, con mayúsculas, minúsculas y números, sin espacios.</p>
                <div className="d-flex flex-wrap gap-2">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setVisible(!visible)}>{visible ? 'Ocultar' : 'Mostrar'} contraseñas</button>
                    <button type="button" className="btn btn-outline-primary" onClick={generate}>Generar contraseña</button>
                    <button type="button" className="btn btn-primary" disabled={!password || !confirmation} onClick={save}>{saving ? 'Guardando…' : 'Guardar contraseña'}</button>
                </div>
            </fieldset>
            {message && <div role="status" className={`alert alert-${message.type} mt-2`}>{message.text}</div>}
        </div>
    );
}
