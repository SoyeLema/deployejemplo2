const bcrypt = require('bcryptjs')
const { Pool } = require('pg')

const pool = new Pool({
    host: 'dpg-ckfkr70l3its73d7skf0-a',
    user: 'postgresql_zd01_user',
    password: 'tnX9FOLFTPMNNyedtfZnDqWelGRuI4Tl',
    database: 'postgresql_zd01',
    port: 5432,
    allowExitOnIdle: true
})

const registrarUsuario = async (usuario) => {
    let { email, password, rol, lenguage } = usuario
    const passwordEncriptada = bcrypt.hashSync(password)
    password = passwordEncriptada
    const values = [email, passwordEncriptada, rol, lenguage]
    const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)"
    try {
        await pool.query(consulta, values)
    } catch (error) {
        console.log(error);
    }
    
}

const obtenerDatosDeUsuario = async (email) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"

    const { rows: [usuario], rowCount } = await pool.query(consulta, values)

    if (!rowCount) {
        throw { code: 404, message: "No se encontró ningún usuario con este email" }
    }

    delete usuario.password
    return usuario
}

const verificarCredenciales = async (email, password) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"

    const { rows: [usuario], rowCount } = await pool.query(consulta, values)
    console.log(usuario);
    const { password: passwordEncriptada } = usuario
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada)
    
    if (!passwordEsCorrecta || !rowCount)
        throw { code: 401, message: "Email o contraseña incorrecta" }
}


module.exports = { registrarUsuario, verificarCredenciales, obtenerDatosDeUsuario }