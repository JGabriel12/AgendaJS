const Cadastro = require('../models/CadastroModel')

exports.index = (req, res) => {
  res.render('cadastro')
}

exports.register = async (req, res) => {
  const cadastro = new Cadastro(req.body)
  await cadastro.register()

  try {
    if (cadastro.errors.length > 0) {
      req.flash('errors', cadastro.errors)
      req.session.save(function () {
        return res.redirect('/cadastro/index')
      })
      return
    }

    req.flash('success', 'Cadastrado com sucesso')
    req.session.save(function () {
      return res.redirect('/cadastro/index')
    })
  } catch (e) {
    console.log(e)
    return res.render('404')
  }
}
