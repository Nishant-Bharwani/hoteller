class QueryHelper {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search(key) {
        const keyword = this.queryStr.keyword
            ? {
                [key]: {
                    $regex: this.queryStr.keyword,
                    $options: 'i'
                }
            }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    sort() {
        const sortOrder = this.queryStr.sort === 'desc' ? -1 : 1;
        this.query = this.query.sort({ createdAt: sortOrder });
        return this;
    }

    paginate() {
        const page = this.queryStr.page ? parseInt(this.queryStr.page, 10) : 1;
        const limit = this.queryStr.limit ? parseInt(this.queryStr.limit, 10) : 10;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = QueryHelper;