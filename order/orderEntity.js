class OrderEntity {
  /**
   * Creates an instance of OrderEntity.
   * @param {Object} options
   * @param {string|string[]} options.keyword
   * @param {string} options.description
   * @param {string} options.example
   * @param {Function} options.func
   *
   * @memberOf OrderEntity
   */
  constructor({keyword, description, example, func}) {

    this.keyword = keyword;
    this.description = description;
    this.example = example;
    this.func = func;
  }
}

module.exports = OrderEntity;
