package com.mycompany.myapp.service.impl;

import static org.elasticsearch.index.query.QueryBuilders.*;

import com.mycompany.myapp.domain.Document;
import com.mycompany.myapp.repository.DocumentRepository;
import com.mycompany.myapp.repository.search.DocumentSearchRepository;
import com.mycompany.myapp.service.DocumentService;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Document}.
 */
@Service
@Transactional
public class DocumentServiceImpl implements DocumentService {

    private final Logger log = LoggerFactory.getLogger(DocumentServiceImpl.class);

    private final DocumentRepository documentRepository;

    private final DocumentSearchRepository documentSearchRepository;

    public DocumentServiceImpl(DocumentRepository documentRepository, DocumentSearchRepository documentSearchRepository) {
        this.documentRepository = documentRepository;
        this.documentSearchRepository = documentSearchRepository;
    }

    @Override
    public Document save(Document document) {
        log.debug("Request to save Document : {}", document);
        Document result = documentRepository.save(document);
        documentSearchRepository.index(result);
        return result;
    }

    @Override
    public Document update(Document document) {
        log.debug("Request to update Document : {}", document);
        Document result = documentRepository.save(document);
        documentSearchRepository.index(result);
        return result;
    }

    @Override
    public Optional<Document> partialUpdate(Document document) {
        log.debug("Request to partially update Document : {}", document);

        return documentRepository
            .findById(document.getId())
            .map(existingDocument -> {
                if (document.getName() != null) {
                    existingDocument.setName(document.getName());
                }
                if (document.getImage() != null) {
                    existingDocument.setImage(document.getImage());
                }
                if (document.getImageContentType() != null) {
                    existingDocument.setImageContentType(document.getImageContentType());
                }

                return existingDocument;
            })
            .map(documentRepository::save)
            .map(savedDocument -> {
                documentSearchRepository.save(savedDocument);

                return savedDocument;
            });
    }

    @Override
    @Transactional(readOnly = true)
    public List<Document> findAll() {
        log.debug("Request to get all Documents");
        return documentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Document> findOne(Long id) {
        log.debug("Request to get Document : {}", id);
        return documentRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Document : {}", id);
        documentRepository.deleteById(id);
        documentSearchRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Document> search(String query) {
        log.debug("Request to search Documents for query {}", query);
        return StreamSupport.stream(documentSearchRepository.search(query).spliterator(), false).collect(Collectors.toList());
    }
}
