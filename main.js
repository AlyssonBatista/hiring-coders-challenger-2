const KEY_BD = '@usuariosestudo'

var listaRegistros = {
  ultimoIdGerado:0,
  usuarios:[]
}

function gravarBD(){
  localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros))
}

function lerBD(){
  const data = localStorage.getItem(KEY_BD)
  if(data){
    listaRegistros = JSON.parse(data)
  }
  desenhar()
}

function desenhar(){
  const tbody = document.getElementById('listaRegistrosBody')
  if(tbody){
    tbody.innerHTML = listaRegistros.usuarios
    .sort((a,b) => {
      a.nome < b.nome ? -1 : 1
    })
    .map( usuario =>
          `<tr>
              <td>${usuario.id}</td>
              <td>${usuario.nome}</td>
              <td>${usuario.produto}</td>              
              <td>${usuario.endereco}</td>              
              <td>${usuario.fone}</td>
              <td>
                  <button onclick='mostrar("cadastro",false,${usuario.id})'>Editar</button>
                  <button class="red" onclick='perguntaSeDeleta(${usuario.id})'>Deletar</button>
              </td>
            </tr>`
    ).join('')
  }
}
function insertUsuario(nome, produto,endereco,fone){
  const id = listaRegistros.ultimoIdGerado + 1;
  listaRegistros.ultimoIdGerado = id;
  listaRegistros.usuarios.push({
    id, nome, produto, endereco,fone
  })
  gravarBD()
  desenhar();
  mostrar('lista');
}

function editUsuario(id, nome, produto, endereco, fone){
      var usuario = listaRegistros.usuarios.find(usuario => usuario.id == id)
      usuario.nome = nome;
      usuario.produto = produto;
      usuario.endereco = endereco;
      usuario.fone = fone;
      gravarBD()
      desenhar()
      mostrar('lista')
}

function deleteUsuario(id){
    listaRegistros.usuarios = listaRegistros.usuarios.filter(usuario => {
      return usuario.id != id
    })
    gravarBD()
    desenhar()

}

function perguntaSeDeleta(id){
  if(confirm('Quer deletar o registro de id ' + id)){
    deleteUsuario(id)
    desenhar()
  }
}

function limparEdicao(){
  document.getElementById('nome').value= ''
  document.getElementById('produto').value= ''
  document.getElementById('endereco').value= ''
  document.getElementById('fone').value= ''
}

function mostrar(pagina, novo=false,  id=null){
  document.body.setAttribute('page', pagina)
  if(pagina === 'cadastro'){
    if(novo==true) limparEdicao()
    if(id){
      const usuario = listaRegistros.usuarios.find(usuario => usuario.id == id)
      if(usuario){
        document.getElementById('id').value= usuario.id
        document.getElementById('nome').value= usuario.nome
        document.getElementById('produto').value= usuario.produto
        document.getElementById('endereco').value= usuario.endereco
        document.getElementById('fone').value= usuario.fone
      }
    }
    document.getElementById('nome').focus()
  }
} 

function submeter(e){
    e.preventDefault()
    const data = {
      id:document.getElementById('id').value,
      nome:document.getElementById('nome').value,
      produto:document.getElementById('produto').value,
      endereco:document.getElementById('endereco').value,
      fone:document.getElementById('fone').value,
    }
    if(data.id){
      editUsuario(data.id,data.nome,data.produto,data.endereco,data.fone)
    }else{
      insertUsuario(data.nome, data.produto, data.endereco,data.fone)
    }
}

window.addEventListener('load', () => {
  lerBD()
  document.getElementById('cadastroRegistros').addEventListener('submit', submeter)
})