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
                                    <em class="nomesMedios" data-dados="${serieNome}">${elemento.elenome}</em>
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
                                <em class="nomesMedios" data-dados="${elemento.serie.serdescricao}">${elemento.elenome}</em>
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
                                <em class="nomesMedios" data-dados="${elemento.serie.serdescricao}">${elemento.elenome}</em>
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
    })
    // Define a pasta 'public' como o local dos arquivos estáticos (CSS, JS, imagens)
        app.use(express.static(path.join(__dirname, 'public')));


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
            res.status(403).send('Acesso Negado');
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
        const [horariosPadrao, agendamentos] = await Promise.all([
            db.HorariosPadrao.findAll({
                raw: true,
                order: [['hp_hora_inicio', 'ASC']]
            }),
            db.sequelize.query(
                `SELECT ht.ht_dia_semana, ht.ht_horario_padrao_id_fk, u.usunome AS professor, t.turnome, d.disc_nome 
                FROM horario_turma ht
                JOIN usuarios u ON ht.ht_professor_usuid_fk = u.usuid
                JOIN turmas t ON ht.ht_turma_id_fk = t.turmid
                JOIN disciplinas d ON ht.ht_disciplina_id_fk = d.disc_id`,
                { type: Sequelize.QueryTypes.SELECT }
            )
        ]);
        const calendario = {};
        agendamentos.forEach(aula => {
            const dia = aula.ht_dia_semana;
            const horaId = aula.ht_horario_padrao_id_fk;
            if (!calendario[dia]) calendario[dia] = {};
            calendario[dia][horaId] = aula;
        });

        res.render('index', {
            layout: 'main',
            horariosPadrao: horariosPadrao,
            calendario: calendario,
            diasDaSemana: [
                {id: 7, nome: 'DOM'}, {id: 1, nome: 'SEG'}, {id: 2, nome: 'TER'},
                {id: 3, nome: 'QUA'}, {id: 4, nome: 'QUI'}, {id: 5, nome: 'SEX'}, {id: 6, nome: 'SÁB'}
            ]
        });
    } catch (erro){
        res.status(500).send("Erro ao carregar o calendário: " + erro);
    }
});

app.get('/login', (req, res) => {
        res.render('login');
    })

app.post('/login', async (req, res) => {
        const {email, senha} = req.body;
        const usuario = await db.Usuarios.verificarLogin(email, senha);

        if (usuario) {
            req.session.user = {
                id: usuario.usuid,
                nome: usuario.usunome,
                cargo: usuario.usucargo
            };

            switch (usuario.usucargo) {
                case 1:
                    res.redirect('/tecnico');
                    break;
                case 2:
                    res.redirect('/professor');
                    break;
                case 3:
                    res.redirect('/aluno');
                    break;
                default:
                    res.redirect('/');
            }
        } else {
            res.send("Email ou senha incorretos. <a href='/login'> Tentar novamente</a>")
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

        const tecnicoId = req.session.user.id;

        const [todosUsuarios, todosItensInventario] = await Promise.all([
            db.Usuarios.findAll({
                raw: true,
                where: { usuid: {[Op.gt]: 1 }},
                order: [['usunome', 'ASC']]
            }),
            db.LaboratorioInventario.findAll({
                include: [{
                    model: Substancias,
                    as: 'substancia',
                    attributes: ['sub_nome']
                }],
                order: [['inv_id', 'DESC']]
            })
        ]);
        const inventarioSimples = todosItensInventario.map(item => item.get({ plain: true }));
        res.render('tecnico', {
            usuarios: todosUsuarios,
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

        const queryHorarios = `
            SELECT 
                ht.ht_dia_semana,
                hp.hp_descricao AS Horario,
                d.disc_nome AS Disciplina,
                t.turnome AS Turma,
                l.labnome AS Laboratorio
            FROM horario_turma AS ht
            JOIN disciplinas AS d ON d.disc_id = ht.ht_disciplina_id_fk
            JOIN turmas AS t ON t.turmid = ht.ht_turma_id_fk
            JOIN laboratorios AS l ON l.labid = ht.ht_laboratorio_id_fk
            JOIN horarios_padrao AS hp ON hp.hp_id = ht.ht_horario_padrao_id_fk
            WHERE ht.ht_professor_usuid_fk = :professor_id
            ORDER BY ht.ht_dia_semana, hp.hp_hora_inicio;
        `;

        const horarios = await db.sequelize.query(queryHorarios, {
            replacements: {professor_id: professorId},
            type: Sequelize.QueryTypes.SELECT
        });

        res.render('professor', {horarios: horarios});
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
            SELECT ht.ht_dia_semana,
                   hp.hp_descricao AS Horario,
                   d.disc_nome     AS Disciplina,
                   u.usunome       AS Professor,
                   l.labnome       AS Laboratorio
            FROM horario_turma AS ht
                     JOIN disciplinas AS d ON d.disc_id = ht.ht_disciplina_id_fk
                     JOIN usuarios AS u ON u.usuid = ht.ht_professor_usuid_fk
                     JOIN laboratorios AS l ON l.labid = ht.ht_laboratorio_id_fk
                     JOIN horarios_padrao AS hp ON hp.hp_id = ht.ht_horario_padrao_id_fk
            WHERE ht.ht_turma_id_fk = :turma_id
            ORDER BY ht.ht_dia_semana, hp.hp_hora_inicio;
        `;

        const horarios = await db.sequelize.query(queryHorarios, {
            replacements: {turma_id: aluno.usuturma},
            type: db.Sequelize.QueryTypes.SELECT
        });
        res.render('aluno', {aluno: aluno, horarios: horarios});
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
        res.render('tabela', {elementos: elementosSimples });
    } catch (erro) {
        console.error("Erro ao Carregar a tabela periódica: " + erro);
        res.status(500).send("Erro ao carregar o tabela periódica: " + erro);
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

app.get("/relatorioAulas", checkAuthenticated, async (req, res)=> {
    try {
        const horarios = await db.HorarioTurma.listarHorariosComDetalhes(); // Chama o método estático
        res.render('relAulas', { aulas: horarios });
    } catch(erro) {
        res.status(500).send("Ocorreu um erro ao gerar o relatório: " + erro);
    }
    });

app.get('/cadAulas', checkRole([1,2]), async (req, res) => {
        try {
            const [laboratorios, turmas, professores, disciplinas, horarios] = await Promise.all([
                db.Laboratorios.findAll({ raw: true, order: [['labnome', 'ASC']] }),
                db.Turmas.findAll({ raw: true, order: [['turnome', 'ASC']] }),
                db.Usuarios.findAll({ raw: true, where: { usucargo: 2 }, order: [['usunome', 'ASC']] }),
                db.Disciplinas.findAll({ raw: true, order: [['disc_nome', 'ASC']] }),
                db.HorariosPadrao.findAll({ raw: true, order: [['hp_hora_inicio', 'ASC']] })
            ]);
            res.render('formulario', {
                laboratorios, turmas, professores, disciplinas, horarios
            });
        } catch(erro){
            res.send("Houve um erro ao carregar o formulário: " + erro);
        };
    });

app.post('/agendar-horario', checkRole([1, 2]), async (req, res) => { // <-- ROTA ATUALIZADA
    try {
        // Renomeie os `name` no seu formulário para estes:
        const { turma, disciplina, professor, laboratorio, dia_semana, horario_padrao } = req.body;
        await db.HorarioTurma.create({
            ht_turma_id_fk: turma,
            ht_disciplina_id_fk: disciplina,
            ht_professor_usuid_fk: professor,
            ht_laboratorio_id_fk: laboratorio,
            ht_dia_semana: dia_semana,
            ht_horario_padrao_id_fk: horario_padrao
        });
        res.redirect('/'); // Redireciona para o calendário para ver o resultado
    } catch (erro) {
        res.send("Houve um erro ao agendar o horário: " + erro);
    }
});


app.get("/relatorioAulas", checkAuthenticated, async (req, res) => { // <-- ROTA ATUALIZADA
    try {
        // Você precisa de uma função que faça a query com JOINs, como a `listarHorariosComDetalhes`
        const horarios = await db.HorarioTurma.listarHorariosComDetalhes();
        res.render('relAulas', {aulas: horarios});
    } catch(erro) {
        res.send("Ocorreu um erro ao gerar o relatório: " + erro);
    }
});

app.get('/agendamentos/novo', checkRole([1, 2]), async (req, res) => {
    try {
        const [laboratorios, turmas, professores, disciplinas, horarios] = await Promise.all([
            db.Laboratorios.findAll({ raw: true, order: [['labnome', 'ASC']] }),
            db.Turmas.findAll({ raw: true, order: [['turnome', 'ASC']] }),
            db.Usuarios.findAll({ raw: true, where: { usucargo: 2 }, order: [['usunome', 'ASC']] }),
            db.Disciplinas.findAll({ raw: true, order: [['disc_nome', 'ASC']] }),
            db.HorariosPadrao.findAll({ raw: true, order: [['hp_hora_inicio', 'ASC']] })
        ]);
        res.render('agendamento_form', { // Sugestão: um nome mais claro para o template
            laboratorios, turmas, professores, disciplinas, horarios
        });
    } catch (erro) {
        res.status(500).send("Houve um erro ao carregar o formulário: " + erro);
    }
});

app.post('/agendamentos', checkRole([1, 2]), async (req, res) => {
    try {
        const { turma_id, disciplina_id, professor_id, laboratorio_id, dia_semana, horario_id } = req.body;
        await db.HorarioTurma.create({
            ht_turma_id_fk: turma_id,
            ht_disciplina_id_fk: disciplina_id,
            ht_professor_usuid_fk: professor_id,
            ht_laboratorio_id_fk: laboratorio_id,
            ht_dia_semana: dia_semana,
            ht_horario_padrao_id_fk: horario_id
        });
        res.redirect('/');
    } catch (erro) {
        res.send("Houve um erro ao agendar o horário: " + erro);
    }
});

app.listen(6969, function() {
    console.log("Servidor Rodando na url http://localhost:6969");
})