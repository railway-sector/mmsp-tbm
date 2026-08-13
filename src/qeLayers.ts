interface QueryExpressionType {
  qValues?: any[];
  qFields?: any[];
  chartCategory?: any;
  chartCategoryField?: any;
  chartCategoryType?: "number" | "string";
  status?: number | null;
  statusField?: any;
  qExpression?: any;
  q2Expression?: any;
}

class QueryExpressionLayers {
  qValues?: any[];
  qFields?: any[];
  chartCategory?: any;
  chartCategoryField?: any;
  chartCategoryType?: "number" | "string" | any;
  status?: number | any;
  statusField?: any;
  qExpression?: any;
  q2Expression?: any;

  constructor(options: QueryExpressionType) {
    this.qValues = options.qValues;
    this.qFields = options.qFields;
    this.chartCategory = options.chartCategory;
    this.chartCategoryField = options.chartCategoryField;
    this.chartCategoryType = options.chartCategoryType;
    this.status = options.status;
    this.statusField = options.statusField;
    this.qExpression = options.qExpression;
    this.q2Expression = options.q2Expression;
  }

  //--- Method ---//
  //--- Query Expression
  queryExpression = () => {
    const formatClause = (field: string, value: string | number) =>
      typeof value === "number"
        ? `${field} = ${value}`
        : `${field} = '${value}'`;

    const clauses: string[] = [];

    //--- qFields/qValues: stop at the first missing value, same as original
    const qValues = this.qValues ?? [];
    const qFields = this.qFields ?? [];
    for (let i = 0; i < qValues.length; i++) {
      if (!qValues[i]) break;
      clauses.push(formatClause(qFields[i], qValues[i]));
    }

    if (this.statusField) {
      clauses.push(`${this.statusField} = ${this.status}`);
    }

    if (this.chartCategoryField) {
      clauses.push(formatClause(this.chartCategoryField, this.chartCategory));
    }

    if (this.qExpression) {
      clauses.push(this.qExpression);
    }

    if (this.q2Expression) {
      clauses.push(this.q2Expression);
    }

    return clauses.length ? clauses.join(" AND ") : "1=1";
  };
}

export default QueryExpressionLayers;
