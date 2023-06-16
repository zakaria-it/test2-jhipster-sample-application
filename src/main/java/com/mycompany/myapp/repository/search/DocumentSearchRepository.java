package com.mycompany.myapp.repository.search;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import com.mycompany.myapp.domain.Document;
import com.mycompany.myapp.repository.DocumentRepository;
import java.util.stream.Stream;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Data Elasticsearch repository for the {@link Document} entity.
 */
public interface DocumentSearchRepository extends ElasticsearchRepository<Document, Long>, DocumentSearchRepositoryInternal {}

interface DocumentSearchRepositoryInternal {
    Stream<Document> search(String query);

    Stream<Document> search(Query query);

    void index(Document entity);
}

class DocumentSearchRepositoryInternalImpl implements DocumentSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;
    private final DocumentRepository repository;

    DocumentSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate, DocumentRepository repository) {
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.repository = repository;
    }

    @Override
    public Stream<Document> search(String query) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        return search(nativeSearchQuery);
    }

    @Override
    public Stream<Document> search(Query query) {
        return elasticsearchTemplate.search(query, Document.class).map(SearchHit::getContent).stream();
    }

    @Override
    public void index(Document entity) {
        repository.findById(entity.getId()).ifPresent(elasticsearchTemplate::save);
    }
}
