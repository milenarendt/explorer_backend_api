
exports.up = knex => knex.schema.createTable("tags", table => {
  table.increments("id");
  table.text("name").notNullable(); // informando que não permite nulo

  table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE"); // se eu deletar a nota que a tag está vinculada, vai deletar a tag automaticamente
  table.integer("user_id").references("id").inTable("users");
});

exports.down = knex => knex.schema.dropTable("tags");
