const express = require('express');
const db = require('./models');
const Sequelize = require('sequelize');
const app = express();
const path = require('path');
const handlebars = require('express-handlebars')
const Handlebars = require('handlebars');
const bodyParser = require('body-parser')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const flash = require('connect-flash');
const {Op} = db.Sequelize;

//  Config
     // Template Engine
        app.engine('handlebars', handlebars.engine({
            defaultLayout: 'main',
            helpers: {
                renderTabelaPeriodica: function(elementos) {
                    const classMap = {
                        1: 'nMetais', 2: 'alcalinos', 3: 'terrosos', 4: 'metais',
                        5: 'sMetais', 6: 'representativos', 7: 'nobres',
                        8: 'lant', 9: 'acti'
                    };

                    const elementosMap = new Map(elementos.map(e => [e.eleid, e]));

                    const layoutPrincipal = [
                        1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,
                        3,  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  5,  6,  7,  8,  9, 10,
                        11, 12, 0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 13, 14, 15, 16, 17, 18,
                        19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
                        37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
                        55, 56, -1, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
                        87, 88, -2, 104,105,106,107,108,109,110,111,112,113,114,115,116,117,118
                    ];

                    let html = '<ol id="extensao" class="principal">';
                    // Adiciona os cabeçalhos dos grupos (1 a 18)
                    html += '<li class="vazio"></li>'; // Espaço para os períodos
                    for (let i = 1; i <= 18; i++) {
                        html += `<li class="familia">Grupo ${i}</li>`;
                    }

                    let periodoAtual = 0;
                    // Loop através da "planta baixa" para construir a tabela principal
                    layoutPrincipal.forEach((id, index) => {
                        // Adiciona o número do período no início de cada nova linha
                        if (index % 18 === 0) {
                            periodoAtual++;
                            html += `<li class="periodo periodo${periodoAtual}" data-num="${periodoAtual}">${periodoAtual}</li>`;
                        }

                        if (id === 0) {
                            html += '<li class="vazio"></li>';
                        } else if (id === -1) { // Marcador do Lantanídeo
                            html += `<li><a class="lEle" href="#lantanideos"><strong>57-71</strong></a></li>`;
                        } else if (id === -2) { // Marcador do Actinídeo
                            html += `<li><a class="lEle" href="#actinideos"><strong>89-103</strong></a></li>`;
                        } else {
                            const elemento = elementosMap.get(id);
                            if (elemento) {
                                const cssClass = elemento.serie ? classMap[elemento.serie.serid] : 'desconhecidos';
                                const serieNome = elemento.serie ? elemento.serie.serdescricao : 'Desconhecido';
                                html += `<li data-id="${elemento.eleid}" class="${cssClass}">
                                <a class="lEle" href="/elemento/${elemento.eleid}">
                                    <strong>${elemento.eleid}</strong>
                                    <div class="simboloQuimico">${elemento.elesimbolo}</div>
                                </a>
                             </li>`;
                            } else {
                                html += '<li class="vazio"></li>'; // Caso um elemento não seja encontrado no mapa
                            }
                        }
                    });

                    html += '</ol>'; // Fim da tabela principal

                    // --- SEÇÃO SEPARADA PARA LANTANÍDEOS E ACTINÍDEOS ---

                    // Lantanídeos
                    html += `<ol id="lantanideos" class="principal extra">`;
                    html += '<li class="vazio"></li>'; // Espaçador
                    for (let i = 57; i <= 71; i++) {
                        const elemento = elementosMap.get(i);
                        if (elemento) {
                            const cssClass = classMap[elemento.serie.serid] || 'desconhecidos';
                            html += `<li data-id="${elemento.eleid}" class="${cssClass}">
                            <a class="lEle" href="/elemento/${elemento.eleid}">
                                <strong>${elemento.eleid}</strong>
                                <div class="simboloQuimico">${elemento.elesimbolo}</div>
                                </a>
                         </li>`;
                        }
                    }
                    html += '</ol>';

                    // Actinídeos
                    html += `<ol id="actinideos" class="principal extra">`;
                    html += '<li class="vazio"></li>'; // Espaçador
                    for (let i = 89; i <= 103; i++) {
                        const elemento = elementosMap.get(i);
                        if (elemento) {
                            const cssClass = classMap[elemento.serie.serid] || 'desconhecidos';
                            html += `<li data-id="${elemento.eleid}" class="${cssClass}">
                            <a class="lEle" href="/elemento/${elemento.eleid}">
                                <strong>${elemento.eleid}</strong>
                                <div class="simboloQuimico">${elemento.elesimbolo}</div>
                                </a>
                         </li>`;
                        }
                    }
                    html += '</ol>';
                    return new Handlebars.SafeString(html);
                },
                section: function(name, options) {
                    if (!this._sections) this._sections = {};
                    this._sections[name] = options.fn(this);
                    return null;
                },
                eq: function(a,b) {
                    return a === b;
                },
                lookup: function(obj, field) {
                    return obj && obj[field];
                },
                dashboardUrl: function(cargoId) {
                    switch (cargoId) {
                        case 1: return '/tecnico';
                        case 2: return '/professor';
                        case 3: return '/aluno';
                        default: return '/';
                    }
                }
            }
        }));
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'handlebars');
    //   Body Parser
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());
    //  Cookie Parser
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(session({
        secret: 'CHAVE',
        resave: false,
        saveUninitialized: true,
        cookie: {maxAge: 86400000}
    }));
    // Passa o Login para toda aplicação.
    app.use((req,res,next)=>{
        res.locals.user = req.session.user || null;
        next();
    });
    app.use(flash());
    app.use((req, res, next) => {
        res.locals.user = req.session.user || null;
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        next();
    });


// Middlewares de Autenticação
    const checkAuthenticated = (req, res, next) => {
        if(req.session.user) {
            return next();
        }
        res.redirect('/login');
    };

    const checkRole = (cargosPermitidos) => {
        return (req,res,next) => {
            if(!req.session.user) {
                return res.redirect('/login');
        }
            if(cargosPermitidos.includes(req.session.user.cargo)){
                return next();
            }
            req.flash('error_msg', 'Acesso Negado: você não tem permissão para acessar esta página.');
            res.redirect('/');
    }
}

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/uploads/avatars/');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });

    const upload = multer({ storage: storage});
//  Rotas

app.get('/', async (req, res) => {
    try {
        const hoje = new Date();
        const inicioSemana = new Date(hoje.setDate(hoje.getDate() - hoje.getDay() + 1)); // Inicia na Segunda
        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 5); // Termina no Sabado
        const [laboratorios, horariosPadrao, agendamentos] = await Promise.all([
            db.Laboratorios.findAll({
                raw: true,
                order: [['labnome', 'ASC']]
            }),
            db.HorariosPadrao.findAll({ raw: true, order: [['hp_hora_inicio', 'ASC']]
            }),
            db.Aulas.findAll({
                where: {
                    aula_data: { // Filtra apenas as aulas desta semana
                        [Op.between]: [inicioSemana, fimSemana]
                    }
                }
            })
        ]);

        const calendario = {};
        agendamentos.forEach(aula => {
            const dia = new Date(aula.aula_data + 'T00:00:00').getDay();
            const diaDaSemana = dia === 0 ? 6 : dia;
            const horaId = aula.aula_horario_padrao_id_fk;
            if (!calendario[diaDaSemana]) calendario[diaDaSemana] = {};
            calendario[diaDaSemana][horaId] = aula.get({ plain: true });
        });

        res.render('index', {
            laboratorios,
            horariosPadrao,
            calendario,
            agendamentosJSON: JSON.stringify(agendamentos),
            diasDaSemana: [
                {id: 1, nome: 'SEG'}, {id: 2, nome: 'TER'},
                {id: 3, nome: 'QUA'}, {id: 4, nome: 'QUI'}, {id: 5, nome: 'SEX'}, {id: 6, nome: 'SÁB'}
            ]
        });
    } catch (erro){
        res.status(500).send("Erro ao carregar o calendário: " + erro);
    }
});

app.get('/login', (req, res) => {
    const { redirect } = req.query;
    if (redirect ) {
        req.session.redirectTo = redirect;
    }
    res.render('login');
    })

app.post('/login', async (req, res) => {
    try {
        const {email, senha} = req.body;
        const usuario = await db.Usuarios.verificarLogin(email, senha);

        if (usuario) {
            req.session.user = {
                id: usuario.usuid,
                nome: usuario.usunome,
                cargo: usuario.usucargo,
                foto_perfil: usuario.usufoto_perfil,
                email: usuario.usuemail
            };

            let redirectUrl = req.session.redirectTo || null;
            delete req.session.redirectTo;

            if (!redirectUrl) {
                switch (usuario.usucargo) {
                    case 1: redirectUrl = '/tecnico'; break;
                    case 2: redirectUrl = '/professor'; break;
                    case 3: redirectUrl = '/aluno'; break;
                    default: redirectUrl = '/';
                }
            }

            return res.json({success: true, redirectUrl: redirectUrl});

        } else {
            return res.status(401).json({success: false, message: 'Email ou senha incorretos.'});
        }
    } catch (erro) {
        console.error('Erro na rota de login:', erro);
        return res.status(500).json({success: false, message: 'Erro interno no servidor.'});
    }
});

app.get('/logout', (req, res) => {
            req.session.destroy(err => {
                if (err) {
                    return res.send("Erro ao fazer logout.");
                }
                res.redirect('/login');
            });
        });

app.get('/tecnico', checkRole([1]), async (req, res) => {
    try {

        const [todosUsuarios, todosItensInventario] = await Promise.all([
            db.Usuarios.findAll({
                where: { usucargo: {[Op.gt]: 0}},
                include: [{
                    model: db.Cargos,
                    as: 'cargo',
                    attributes: ['cargnome'],
                }],
                order: [['usunome', 'ASC']]
            }),
            db.LaboratorioInventario.findAll({
                include: [{
                    model: db.Substancias,
                    as: 'substancia',
                    attributes: ['sub_nome']
                }],
                order: [['inv_id', 'DESC']]
            })
        ]);
        const usuariosSimples = todosUsuarios.map(user => user.get({ plain: true }));
        const inventarioSimples = todosItensInventario.map(item => item.get({ plain: true }));
        res.render('tecnico', {
            usuarios: usuariosSimples,
            inventario: inventarioSimples
        });
    } catch (erro) {
        console.error("Erro na rota /tecnico:" + erro);
        res.status(500).send("Erro ao carregar dados do tecnico: " + erro);
    }
});

app.get('/professor', checkRole([2]), async (req, res) => {
    try {

        const professorId = req.session.user.id;

        const queryAulasDaSemana = `
            SELECT
                a.aula_data,
                hp.hp_descricao AS horario,
                d.disc_nome AS disciplina,
                t.turnome AS turma,
                l.labnome AS laboratorio,
                DAYOFWEEK(a.aula_data) as dia_da_semana_num
            FROM aulas AS a
                     JOIN disciplinas AS d ON d.disc_id = a.aula_disciplina_id_fk
                     JOIN turmas AS t ON t.turmid = a.aula_turma_id_fk
                     JOIN laboratorios AS l ON l.labid = a.aula_laboratorio_id_fk
                     JOIN horarios_padrao AS hp ON hp.hp_id = a.aula_horario_padrao_id_fk
            WHERE
                a.aula_professor_usuid_fk = :professor_id AND
                a.aula_data >= CURDATE()
            ORDER BY a.aula_data, hp.hp_hora_inicio;
        `;

        const aulas = await db.sequelize.query(queryAulasDaSemana, {
            replacements: {
                professor_id: professorId
            },
            type: db.Sequelize.QueryTypes.SELECT
        });

        const dias = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
        const aulasFormatadas = aulas.map(aula => {
            const dataObj = new Date(aula.aula_data + 'T00:00:00');
            const dia = String(dataObj.getDate()).padStart(2, '0');
            const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
            const ano = dataObj.getFullYear();
            return {
            ...aula,
            data_formatada: `${dia}/${mes}/${ano}`,
            dia_semana_nome: dias[dataObj.getDay()]
            }
        });

        res.render('professor', { aulas: aulasFormatadas });
    } catch (erro) {
        res.status(500).send("Erro ao carregar dados do professor: " + erro);
    }
});

app.get('/aluno', checkRole([3]), async (req, res) => {
    try {
        const userId = req.session.user.id;
        const aluno = await db.Usuarios.findByPk(userId, {raw: true});

        if (!aluno || !aluno.usuturma) {
            return res.render('aluno', {aluno: aluno, horarios: []});
        }

        const queryHorarios = `
            SELECT
                a.aula_data,
                hp.hp_descricao AS Horario,
                d.disc_nome     AS Disciplina,
                u.usunome       AS Professor,
                l.labnome       AS Laboratorio
            FROM aulas AS a
                     JOIN disciplinas AS d ON d.disc_id = a.aula_disciplina_id_fk
                     JOIN usuarios AS u ON u.usuid = a.aula_professor_usuid_fk
                     JOIN laboratorios AS l ON l.labid = a.aula_laboratorio_id_fk
                     JOIN horarios_padrao AS hp ON hp.hp_id = a.aula_horario_padrao_id_fk
            WHERE
                a.aula_turma_id_fk = :turma_id AND
                a.aula_data >= CURDATE() -- Mostra apenas aulas de hoje em diante
            ORDER BY a.aula_data, hp.hp_hora_inicio;
        `;

        const horarios = await db.sequelize.query(queryHorarios, {
            replacements: {turma_id: aluno.usuturma},
            type: db.Sequelize.QueryTypes.SELECT
        });

        const dias = [ "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
        const horariosFormatados = horarios.map(aula => {
            const dataObj = new Date(aula.aula_data + 'T00:00:00');
            return {
                ...aula,
                data_formatada: dataObj.toLocaleDateString('pt-BR', {timeZone: 'UTC'}),
                dia_semana_nome: dias[dataObj.getDay()]
            }
        });

        res.render('aluno', { aluno: aluno, horarios: horariosFormatados });
    } catch (erro) {
        res.status(500).send("Erro ao carregar o aluno: " + erro);
    }
});

app.get('/usuarios', checkRole([1]), async (req, res) => {
    try {
        const usuarios = await db.Usuarios.findAll({
            where: {
                usuid: {[Op.gt]: 1 },
                usucargo: {[Op.in]: [2,3]}
            },
            include: [{
                model: Cargos,
                as: 'cargo'
            }],
            order: [['usunome', 'ASC']]
        });
        res.render('usuarios_lista', {usuarios: usuarios.map(u => u.get({ plain: true})) });
    } catch (erro) {
        res.status(500).send("Erro ao carregar o usuario: " + erro);
    }
});

app.get('/usuarios/novo', checkRole([1]), async (req, res) => {
   try {
       const [cargos, turmas] = await Promise.all([
           db.Cargos.findAll({
               raw: true,
               where: { cargid: {[Op.in]: [2,3]}}
           }),
           Turmas.findAll({
               raw: true,
               order: [['turnome', 'ASC']]
           })
       ]);
       res.render('usuarios_form', {cargos, turmas});
   } catch (erro) {
       res.status(500).send("Erro ao carregar o formulário: " + erro);
   }
});

// Rota para processar a criação
app.post('/usuarios', checkRole([1]), async (req, res) => {
    try {
        const { nome, email, senha, cargo, turma } = req.body;
        // Validação extra para garantir que não estão criando um técnico ou admin
        if (parseInt(cargo) > 1) {
            await sp_add_usuario(nome, cargo, turma, email, senha);
            res.redirect('/usuarios');
        } else {
            res.status(403).send('Ação não permitida.');
        }
    } catch (erro) {
        res.status(500).send("Erro ao criar usuário: " + erro);
    }
});


// --- Rotas para EDITAR um usuário existente (UPDATE) ---

// Rota para mostrar o formulário de edição com os dados do usuário
app.get('/usuarios/editar/:id', checkRole([1]), async (req, res) => {
    try {
        const usuarioId = req.params.id;
        const [usuario, cargos, turmas] = await Promise.all([
            db.Usuarios.findOne({ where: { usuid: usuarioId, usucargo: { [Op.in]: [2, 3] } } }),
            db.Cargos.findAll({ raw: true, where: { cargid: { [Op.in]: [2, 3] } } }),
            db.Turmas.findAll({ raw: true, order: [['turnome', 'ASC']] })
        ]);

        if (usuario) {
            res.render('usuarios_form', {
                usuario: usuario.get({ plain: true }),
                cargos,
                turmas
            });
        } else {
            res.status(404).send('Usuário não encontrado ou não permitido para edição.');
        }
    } catch (erro) {
        res.status(500).send("Erro ao carregar formulário de edição: " + erro);
    }
});

// Rota para processar a atualização
app.post('/usuarios/editar/:id', checkRole([1]), async (req, res) => {
    try {
        const usuarioId = req.params.id;
        const { nome, email, cargo, turma } = req.body;

        await db.Usuarios.update(
            {
                usunome: nome,
                usuemail: email,
                usucargo: cargo,
                usuturma: (cargo == 3) ? turma : null
            },
            {
                where: {
                    usuid: usuarioId,
                    usucargo: { [Op.in]: [2, 3] } // Garante que só possa editar prof/aluno
                }
            }
        );
        res.redirect('/usuarios');
    } catch (erro) {
        res.status(500).send("Erro ao atualizar usuário: " + erro);
    }
});


// --- Rota para DELETAR um usuário ---
app.post('/usuarios/deletar/:id', checkRole([1]), async (req, res) => {
    try {
        await db.Usuarios.destroy({
            where: {
                usuid: req.params.id,
                usucargo: { [Op.in]: [2, 3] } // Garante que só possa deletar prof/aluno
            }
        });
        res.redirect('/usuarios');
    } catch (erro) {
        res.status(500).send("Erro ao deletar usuário: " + erro);
    }
});

app.get('/tabela', async (req, res) => {
    try {
        const todosOsElementos = await db.Elemento.findAll({
            include: [{
                model: db.Serie,
                as: 'serie'
            }],
            order: [['eleid', 'ASC']]
        });

        const elementosSimples = todosOsElementos.map(el => el.get({ plain: true}));

        const classMap = {
            1: 'nMetais', 2: 'alcalinos', 3: 'terrosos', 4: 'metais',
            5: 'sMetais', 6: 'representativos', 7: 'nobres',
            8: 'lant', 9: 'acti'
        };

        res.render('tabela', {
            elementos: elementosSimples,
            classMapJSON: JSON.stringify(classMap)
        });
    } catch (erro) {
        console.error("Erro ao Carregar a tabela periódica: " + erro);
        res.status(500).send("Erro ao carregar o tabela periódica: " + erro);
    }
});

app.get('/api/elementos/:id', async (req, res) => {
    try {
        const elementoId = req.params.id;
        const elemento = await db.Elemento.findByPk(elementoId, {
            include: [
                { model: db.Serie, as: 'serie' },
                { model: db.Estafisi, as: 'estadoFisico' }
            ]
        });

        if (elemento) {
            res.json(elemento); // Se encontrou, responde com os dados em JSON
        } else {
            res.status(404).json({ error: 'Elemento não encontrado' });
        }
    } catch (erro) {
        console.error("Erro ao buscar elemento:", erro);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

app.get('/preparo', async (req, res) => {
    try {
        const todasAsSolucoes = await db.Solucoes.findAll({
            raw: true,
            order: [['sol_nome', 'ASC']]
        });
        res.render('preparo', { solucoes: todasAsSolucoes });
    } catch (erro) {
        console.error("Erro ao carregar a página de preparo: " + erro);
        res.status(500).send("Erro ao carregar o preparo: " + erro);
    }
});

app.get('/vidrarias', async (req, res) => {
   try {
       const todasAsVidrarias = await db.Vidrarias.findAll({
           raw: true,
           order: [['vid_nome', 'ASC']]
       });
       res.render('vidrarias', { vidrarias: todasAsVidrarias });
   } catch (erro) {
       console.error("Erro ao carregar a página de vidrarias:", erro);
       res.status(500).send("Erro ao buscar vidrarias: " + erro);
   }
});

app.get('/api/vidrarias/:id', async (req, res) => {
    try {
        const vidrariaId = req.params.id;
        const vidraria = await db.Vidrarias.findByPk(vidrariaId);

        if (vidraria) {
            res.json(vidraria); // Se encontrou, responde com os dados em JSON
        } else {
            res.status(404).json({ error: 'Vidraria não encontrada' });
        }
    } catch (erro) {
        console.error("Erro ao buscar detalhes da vidraria:", erro);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

app.get('/aulas/nova', checkRole([1, 2]), async (req, res) => {
    try {
        const loggedInUser = req.session.user;
        let professores = [];

        // Se for um técnico, busca a lista de todos os professores.
        if (loggedInUser.cargo === 1) {
            professores = await db.Usuarios.findAll({
                raw: true,
                where: { usucargo: 2 }, // Apenas cargo de Professor
                order: [['usunome', 'ASC']]
            });
        }

        const [laboratorios, turmas, disciplinas, horariosPadrao] = await Promise.all([
            db.Laboratorios.findAll({ raw: true, order: [['labnome', 'ASC']] }),
            db.Turmas.findAll({ raw: true, order: [['turnome', 'ASC']] }),
            db.Disciplinas.findAll({ raw: true, order: [['disc_nome', 'ASC']] }),
            db.HorariosPadrao.findAll({ raw: true, order: [['hp_hora_inicio', 'ASC']] })
        ]);

        res.render('agendamento_form', {
            laboratorios, turmas, professores, disciplinas, horariosPadrao
        });
    } catch (erro) {
        console.error("Erro ao carregar formulário de agendamento:", erro);
        res.status(500).send("Houve um erro ao carregar o formulário.");
    }
});

app.post('/aulas', checkRole([1, 2]), async (req, res) => {
    try {

        const { laboratorio_id, professor_id, turma_id, disciplina_id, horario_id, data, tema } = req.body;

        // --- VALIDAÇÃO DA DATA ---
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const dataMinima = new Date(hoje);
        dataMinima.setDate(hoje.getDate() + 2);

        const dataMaxima = new Date(hoje);
        dataMaxima.setDate(hoje.getDate() + 30);

        const dataEnviada = new Date(data + 'T00:00:00'); //

        if (dataEnviada < dataMinima || dataEnviada > dataMaxima) {
            return res.status(400).send("Data de agendamento inválida. Deve ser entre 2 e 30 dias a partir de hoje.");
        }

        const conflito = await db.Aulas.findOne({
            where: {
                aula_data: data,
                aula_horario_padrao_id_fk: horario_id,
                aula_laboratorio_id_fk: laboratorio_id
            }
        });

        if (conflito) {
            return res.status(409).send("Conflito de horário. Este laboratório já está reservado nesta data e horário. <a href='/aulas/nova'>Tentar novamente</a>");
        }

        await db.Aulas.create({
            aula_laboratorio_id_fk: laboratorio_id,
            aula_professor_usuid_fk: professor_id,
            aula_turma_id_fk: turma_id,
            aula_disciplina_id_fk: disciplina_id,
            aula_horario_padrao_id_fk: horario_id,
            aula_data: data,
            aula_tema: tema
        });

        res.redirect('/');

    } catch (erro) {
        console.error("Erro ao agendar aula:", erro);
         res.status(500).send("Houve um erro ao agendar a aula: " + erro.message);
    }
});

app.listen(6969, function() {
    console.log("Servidor Rodando na url http://localhost:6969");
})