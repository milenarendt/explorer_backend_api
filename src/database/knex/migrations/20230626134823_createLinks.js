
exports.up = knex => knex.schema.createTable("links", table => {
  table.increments("id");
  table.text("url").notNullable(); // informando que não permite nulo

  table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE"); // se eu deletar a nota que a tag está vinculada, vai deletar a tag automaticamente
  table.timestamp("created_at").default(knex.fn.now())
});

exports.down = knex => knex.schema.dropTable("links");
