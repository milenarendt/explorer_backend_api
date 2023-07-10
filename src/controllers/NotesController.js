const knex = require("../database/knex")

class NotesController {
  async create(request, response) {
    const { title, description, tags, links } = request.body
    const { user_id } = request.params

    const [ note_id ] = await knex("notes").insert({
      title,
      description,
      user_id
    })

    const linksInsert = links.map(link => {
      return {
        note_id,
        url: link
      }
    })
 
    await knex("links").insert(linksInsert)  // inserindo na tabela links, o linksInsert

    const tagsInsert = tags.map(name => {
      return {
        note_id,
        name,
        user_id
      }
    })

    await knex("tags").insert(tagsInsert) // inserindo na tabela tags, o tagsInsert

    response.json()
  }

  async show(request, response) {
    const { id } = request.params

    const note = await knex("notes").where({ id }).first() // pegando da tabela de notas, por id, apenas 1 nota

    const tags = await knex("tags").where({ note_id: id }).orderBy("name") // para mostrar também as tags, ordenadas pelo nome (ordem alfabética)
    const links = await knex("links").where({ note_id: id}).orderBy("created_at") // para mostrar também os links, ordenadas por ordem de criação

    return response.json({
      ...note,  // pega todos os detalhes das notas
      tags,
      links
    })
  }

  async delete(request, response) {
    const { id } = request.params

    await knex("notes").where({ id }).delete()

    return response.json()
  }

  async index(request, response) {
    const { user_id, title, tags } = request.query

    let notes

    if(tags){
      const filterTags = tags.split(',').map(tag => tag.trim())

      notes = await knex("tags")
      .select([
        "notes.id",
        "notes.title",
        "notes.user_id"
      ])
      .where("notes.user_id", user_id)
      .whereLike("notes.title", `%${title}%`)
      .whereIn("name", filterTags)
      .innerJoin("notes", "notes_id", "tags.note_id")
      .orderBy("notes.title")

    }else {
    notes = await knex("notes")
    .where({ user_id })
    .whereLike("title", `%${title}%`) // para pesquisar pela palavra chave, vai ver se a palavra existe antes ou depois (por isso o sinal de %) dentro do titulo - para não precisar consultar pelo titulo exato
    .orderBy("title")
    }

    const userTags = await knex("tags").where({ user_id })
    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note.id === note_id)

      return {
        ...note,
        tags: noteTags
      }
    })

    return response.json(notesWithTags)
    
  }
}



module.exports = NotesController