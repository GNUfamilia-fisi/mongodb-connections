// For more information on writing tests, see
// https://scalameta.org/munit/docs/getting-started.html

class MySuite extends munit.FunSuite {
  test("checks if the grade received is the maximum grade") {
    val note_esperada = "20"
    val nota_obtenida = "??"

    assertEquals(
      note_esperada,
      nota_obtenida
    )
  }
}
